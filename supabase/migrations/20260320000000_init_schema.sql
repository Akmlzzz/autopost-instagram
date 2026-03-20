-- Buat tipe Enum untuk status asset
CREATE TYPE asset_status AS ENUM ('draft', 'scheduled', 'posted', 'failed');

-- Tabel: ig_accounts
CREATE TABLE ig_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) NOT NULL,
    session_data JSONB, -- Simpan session cookie instagrapi di sini (format JSON)
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: folders
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE, -- Hubungan ke subfolder
    auto_post_enabled BOOLEAN DEFAULT false,
    post_interval_hours INTEGER DEFAULT 24,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabel: assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    ig_account_id UUID REFERENCES ig_accounts(id) ON DELETE SET NULL, -- Relasikan postingan ini agar otomatis me-ngarah ke akun yang mana
    storage_url TEXT NOT NULL,
    caption TEXT,
    status asset_status DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes untuk performa optimal query Bot scheduler (misal mencari post yang mau dikirim hari ini)
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_scheduled_at ON assets(scheduled_at);

-- Composite Index: Sangat efisien ketika Bot mengeksekusi "SELECT * FROM assets WHERE status = 'scheduled' AND scheduled_at <= NOW()"
CREATE INDEX idx_assets_status_scheduled_at ON assets(status, scheduled_at);

-- === Fitur Opsional Supabase: Row Level Security (RLS) Best Practice ===
ALTER TABLE ig_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own IG accounts"
    ON ig_accounts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own folders"
    ON folders FOR ALL USING (auth.uid() = user_id);

-- Asset tidak punya user_id langsung, tapi kita joinkan melalui folders untuk check RLS-nya
CREATE POLICY "Users can manage assets in their folders"
    ON assets FOR ALL USING (
        EXISTS (
            SELECT 1 FROM folders WHERE folders.id = assets.folder_id AND folders.user_id = auth.uid()
        )
    );
