import { Images, FolderOpen, ListOrdered, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const STATS = [
  {
    label: 'Total Assets',
    value: '128',
    sub: '+12 this week',
    icon: Images,
    color: 'text-neutral-400',
    ring: 'ring-white/10',
    bg: 'bg-white/[0.04]',
  },
  {
    label: 'Folders',
    value: '16',
    sub: '3 with auto-post',
    icon: FolderOpen,
    color: 'text-neutral-400',
    ring: 'ring-white/10',
    bg: 'bg-white/[0.04]',
  },
  {
    label: 'In Queue',
    value: '24',
    sub: 'Next in 2h 15m',
    icon: ListOrdered,
    color: 'text-lime-400',
    ring: 'ring-lime-400/20',
    bg: 'bg-lime-400/[0.06]',
  },
  {
    label: 'Posted Today',
    value: '7',
    sub: '100% success rate',
    icon: CheckCircle2,
    color: 'text-neutral-400',
    ring: 'ring-white/10',
    bg: 'bg-white/[0.04]',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-neutral-100">All Assets</h1>
        <Badge
          variant="outline"
          className="border-lime-400/30 bg-lime-400/10 text-lime-400 text-[11px]"
        >
          Live
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map(({ label, value, sub, icon: Icon, color, ring, bg }) => (
          <div
            key={label}
            className={`rounded-xl border p-4 ring-1 transition-all hover:brightness-110 ${bg} border-white/[0.07] ${ring}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-500">
                {label}
              </span>
              <Icon className={`h-4 w-4 ${color}`} strokeWidth={1.75} />
            </div>
            <p className="text-2xl font-bold text-neutral-100">{value}</p>
            <p className="mt-0.5 text-[11px] text-neutral-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Empty state placeholder — replace with real asset grid */}
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/2 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 ring-1 ring-lime-400/25">
          <Images className="h-6 w-6 text-lime-400" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-medium text-neutral-300">No assets yet</p>
        <p className="mt-1 text-xs text-neutral-600">
          Click &quot;Batch Upload&quot; to add your first images.
        </p>
      </div>
    </div>
  )
}
