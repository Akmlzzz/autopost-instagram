import os
import sys
import datetime
import requests
import json
import logging
import traceback
from pathlib import Path
from dotenv import load_dotenv

from supabase import create_client, Client
from instagrapi import Client as InstaClient
from instagrapi.exceptions import LoginRequired

# ==========================================
# KONFIGURASI DAN LOGGING
# ==========================================
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load env variables (Bisa dari .env atau dari GitHub Actions Secrets)
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
# Supabase Service Role Key sangat disarankan untuk skrip backend agar bebas dari batasan RLS
SUPABASE_KEY = os.getenv("SUPABASE_KEY") 
IG_USERNAME = os.getenv("IG_USERNAME")
IG_PASSWORD = os.getenv("IG_PASSWORD")

# Simpan cookie Instagram login ke format JSON. 
# Jika di GitHub Actions, lebih ideal di-cache di repo secret atau GitHub cache.
SESSION_FILE = "ig_session.json"  

if not all([SUPABASE_URL, SUPABASE_KEY, IG_USERNAME, IG_PASSWORD]):
    logger.error("Error: Environment variables SUPABASE_URL, SUPABASE_KEY, IG_USERNAME, IG_PASSWORD wajib di-set.")
    sys.exit(1)


# ==========================================
# FUNGSI-FUNGSI BANTUAN
# ==========================================

def get_supabase() -> Client:
    """Inisialisasi klien Supabase"""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def login_instagram() -> InstaClient:
    """Melakukan login Instagram dengan state / cookie preservation (mencegah Banned)"""
    cl = InstaClient()
    session_file_path = Path(SESSION_FILE)
    
    if session_file_path.exists():
        logger.info("Session tersimpan ditemukan. Memuat...")
        cl.load_settings(session_file_path)
        try:
            # Memastikan session belum basi dengan mengakses fitur sederhana
            cl.get_timeline_feed()
            logger.info("Session valid. Berhasil login via session cache!")
            return cl
        except LoginRequired:
            logger.warning("Session basi / ditolak oleh Instagram. Mewajibkan login ulang...")
            # Fallthrough (lanjut eksekusi ke kode login di bawahnya)
        except Exception as e:
            logger.warning(f"Error pengecekan session: {e}. Mencoba login ulang...")
    
    # Blok mengeksekusi Login Ulang via Username dan Password
    logger.info("Memasukkan kredensial untuk login...")
    cl.login(IG_USERNAME, IG_PASSWORD)
    
    # Save sesion agar selanjutnya tidak kena login challenge baru yang berpotensi dianggap suspicious activity
    cl.dump_settings(session_file_path)
    logger.info("Session login baru tersimpan sempurna.")
    
    return cl

def download_image(url: str, dest_path: str):
    """Download gambar target dari Supabase Storage atau source storage lainnya"""
    logger.info(f"Mengunduh aset dari {url}")
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(dest_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    logger.info(f"Aset diunduh ke lokasi {dest_path}")


# ==========================================
# RUTINITAS UTAMA BOT
# ==========================================

def main():
    logger.info("=== Menjalankan worker Auto-Post Instagram ===")
    
    supabase = get_supabase()
    
    try:
        # 1. Cari aset yang siap di-post saat ini.
        # Format Waktu UTC menyesuaikan standarnya Supabase (TIMESTAMPTZ).
        now_utc = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        logger.info(f"Mencari postingan dengan jadwal <= {now_utc}")
        response = supabase.table('assets') \
            .select('*') \
            .eq('status', 'scheduled') \
            .lte('scheduled_at', now_utc) \
            .order('scheduled_at') \
            .limit(1) \
            .execute()
            
        data = response.data
        if not data:
            logger.info("Zero-Queue: Tidak ada jadwal postingan tertunda untuk dieksekusi saat ini.")
            return

        asset = data[0]
        asset_id = asset['id']
        storage_url = asset['storage_url']
        caption = asset.get('caption', '') or '' # Avoid NoneType
        
        logger.info(f"Ditemukan scheduled post untuk ID aset: {asset_id}")
        
    except Exception as e:
        logger.error(f"Kegagalan fatal saat menghubungi database backend: {str(e)}")
        sys.exit(1)

    # 2. Proses Auto-Posting
    temp_img_path = "temp_ig_post.jpg"
    
    try:
        download_image(storage_url, temp_img_path)
        
        insta_client = login_instagram()
        
        logger.info("Proses unggah (post) sedang berlangsung...")
        # Lakukan Posting Photo Insta (Ini secara otomatis meng-crop foto ke rasio kotak IG kalau formatnya berbeda)
        insta_client.photo_upload(temp_img_path, caption)
        
        logger.info("Berhasil! Aset ter-publish ke Instagram 🎉")
        
        # 3. Update database: Berhasil
        supabase.table('assets').update({
            'status': 'posted',
            'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
        }).eq('id', asset_id).execute()
        
    except Exception as inst_err:
        error_msg = str(inst_err)
        logger.error(f"Kegagalan saat proses Instagram/Unduhan: {error_msg}")
        logger.error(traceback.format_exc())
        
        # 3. Update database: Error/Failed
        try:
            supabase.table('assets').update({
                'status': 'failed',
                'updated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                # Optional: Jika nambah kolom error log text: 'error_log': error_msg
            }).eq('id', asset_id).execute()
        except Exception as db_err:
             logger.error(f"Gagal mengupdate status fail ke Database: {db_err}")

    finally:
        # 4. Clean up / Menghapus file lokal supaya rapi
        if os.path.exists(temp_img_path):
            os.remove(temp_img_path)
            logger.info("Menyapu file residu.")

if __name__ == "__main__":
    main()
