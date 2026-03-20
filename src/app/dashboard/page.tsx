import { 
  Image as ImageIcon, 
  Clock, 
  Folder, 
  CheckCircle2, 
  CalendarClock, 
  FileEdit 
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AssetModal } from '@/components/dashboard/asset-modal'

const STATS = [
  { label: 'Total Posts', value: '1,248', icon: ImageIcon },
  { label: 'Upcoming', value: '34', icon: Clock },
  { label: 'Total Folders', value: '12', icon: Folder },
]

const FOLDERS = [
  { id: 1, name: 'Q3 Marketing Assets', count: 128, autoPost: true },
  { id: 2, name: 'Product Launches', count: 45, autoPost: true },
  { id: 3, name: 'Behind the Scenes', count: 87, autoPost: false },
  { id: 4, name: 'User Testimonials', count: 24, autoPost: false },
]

const RECENT_ASSETS = [
  { id: 1, name: 'campaign-hero-1.jpg', status: 'POSTED' },
  { id: 2, name: 'product-teaser-vid.mp4', status: 'SCHEDULED' },
  { id: 3, name: 'bts-office-tour.jpg', status: 'SCHEDULED' },
  { id: 4, name: 'draft-design-v2.png', status: 'DRAFT' },
  { id: 5, name: 'story-template-a.jpg', status: 'DRAFT' },
]

function renderBadge(status: string) {
  switch (status) {
    case 'POSTED':
      return (
        <Badge className="border-transparent bg-lime-400 text-[10px] font-extrabold tracking-widest text-neutral-950 hover:bg-lime-400">
          <CheckCircle2 className="mr-1.5 h-3 w-3" strokeWidth={2.5} />
          POSTED
        </Badge>
      )
    case 'SCHEDULED':
      return (
        <Badge className="border-neutral-200 bg-neutral-100 text-[10px] font-bold tracking-widest text-neutral-900 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800">
          <CalendarClock className="mr-1.5 h-3 w-3" strokeWidth={2} />
          SCHEDULED
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="border-neutral-300 bg-transparent text-[10px] font-bold tracking-widest text-neutral-500 hover:bg-transparent dark:border-neutral-700">
          <FileEdit className="mr-1.5 h-3 w-3" strokeWidth={2} />
          DRAFT
        </Badge>
      )
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-12 pb-10">
      {/* Overview Stats */}
      <section>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:bg-neutral-50 dark:border-white/5 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/80"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-100 ring-1 ring-neutral-200 dark:bg-white/5 dark:ring-white/10">
                <Icon className="h-6 w-6 text-neutral-400" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                  {label}
                </span>
                <span className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Folders */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Active Folders</h2>
          <button className="text-xs font-bold tracking-wide text-lime-600 transition-colors hover:text-lime-500 dark:text-lime-400 dark:hover:text-lime-300">
            VIEW ALL
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOLDERS.map((folder) => (
            <div
              key={folder.id}
              className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:bg-neutral-50 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:shadow-black/50"
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-100 ring-1 ring-lime-200 transition-colors group-hover:bg-lime-200 dark:bg-lime-400/10 dark:ring-lime-400/30 dark:group-hover:bg-lime-400/20">
                  <Folder className="h-5 w-5 text-lime-600 dark:text-lime-400" strokeWidth={2.5} />
                </div>
                {folder.autoPost && (
                  <span className="text-[9px] font-extrabold tracking-widest text-lime-600 dark:text-lime-400/90">
                    AUTO-POST ENABLED
                  </span>
                )}
              </div>
              <div>
                <h3 className="truncate text-base font-extrabold text-neutral-900 transition-colors group-hover:text-black dark:text-neutral-200 dark:group-hover:text-white">
                  {folder.name}
                </h3>
                <p className="mt-1.5 text-xs font-medium text-neutral-500">
                  {folder.count} ASSETS
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Assets */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">Recent Assets</h2>
          <button className="text-xs font-bold tracking-wide text-lime-600 transition-colors hover:text-lime-500 dark:text-lime-400 dark:hover:text-lime-300">
            VIEW QUEUE
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {RECENT_ASSETS.map((asset) => (
            <AssetModal key={asset.id} assetName={asset.name}>
              <div
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:shadow-black/50"
              >
                {/* Image Placeholder Background */}
                <div className="absolute inset-0 bg-linear-to-tr from-neutral-300 to-neutral-100 opacity-60 transition-transform duration-700 group-hover:scale-110 dark:from-neutral-950 dark:to-neutral-800" />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-3.5">
                  <div className="relative">
                    {renderBadge(asset.status)}
                  </div>
                  <div className="relative mt-auto">
                    <div className="truncate rounded-lg bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-neutral-900 shadow-sm backdrop-blur-md dark:bg-black/80 dark:text-neutral-300">
                      {asset.name}
                    </div>
                  </div>
                </div>
              </div>
            </AssetModal>
          ))}
        </div>
      </section>
    </div>
  )
}
