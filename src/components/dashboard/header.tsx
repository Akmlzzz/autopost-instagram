'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'All Assets',
  folders: 'Folders',
  queue: 'Queue',
  accounts: 'IG Accounts',
  settings: 'Settings',
}

function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/')
    const label = ROUTE_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1)
    return { label, href }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-200"
      >
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {crumbs.slice(1).map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-neutral-400 dark:text-neutral-700" />
          <Link
            href={crumb.href}
            className={
              i === crumbs.length - 2
                ? 'font-medium text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-200'
            }
          >
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  )
}

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white/80 border-neutral-200 px-6 backdrop-blur-md dark:border-white/[0.07] dark:bg-[oklch(0.09_0_0)]/80">
      {/* Breadcrumbs */}
      <div className="flex-1">
        <Breadcrumbs />
      </div>

      {/* Search bar */}
      <div className="relative hidden w-64 sm:block">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-600" />
        <input
          id="dashboard-search"
          type="search"
          placeholder="Search assets..."
          className="h-8 w-full rounded-lg border bg-neutral-50 border-neutral-200 pl-8 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 outline-none transition focus:border-lime-400/60 focus:bg-white focus:ring-2 focus:ring-lime-400/20 dark:border-white/8 dark:bg-white/5 dark:text-neutral-300 dark:placeholder:text-neutral-600 dark:focus:bg-white/8"
        />
      </div>

      {/* CTA Button */}
      <Button
        id="batch-upload-btn"
        className="h-8 gap-1.5 bg-lime-400 px-3 text-xs font-bold text-neutral-950 shadow-[0_0_16px_oklch(0.88_0.234_128.48/30%)] transition-all hover:bg-lime-300 hover:shadow-[0_0_24px_oklch(0.88_0.234_128.48/50%)] active:scale-95"
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={3} />
        Batch Upload
      </Button>
    </header>
  )
}
