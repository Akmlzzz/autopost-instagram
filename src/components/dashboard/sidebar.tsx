'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Images,
  FolderOpen,
  ListOrdered,
  UserCircle2,
  Settings,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const NAV_ITEMS = [
  { label: 'All Assets', href: '/dashboard', icon: Images },
  { label: 'Folders', href: '/dashboard/folders', icon: FolderOpen },
  { label: 'Queue', href: '/dashboard/queue', icon: ListOrdered },
  { label: 'IG Accounts', href: '/dashboard/accounts', icon: UserCircle2 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[68px] flex-col items-center gap-2 border-r border-white/[0.07] bg-[oklch(0.11_0_0)] py-4">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 ring-1 ring-lime-400/30 transition-all hover:bg-lime-400/20"
        aria-label="Home"
      >
        <Zap className="h-5 w-5 text-lime-400" strokeWidth={2.5} />
      </Link>

      {/* Separator line */}
      <div className="mb-2 h-px w-8 bg-white/10" />

      {/* Nav items */}
      <nav className="flex flex-1 flex-col items-center gap-1" aria-label="Sidebar navigation">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)

          return (
            <Tooltip key={href}>
              <TooltipTrigger
                render={
                  <Link
                    href={href}
                    aria-label={label}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150',
                      isActive
                        ? 'bg-lime-400/12 text-lime-400 ring-1 ring-lime-400/25'
                        : 'text-neutral-500 hover:bg-white/6 hover:text-neutral-100'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-[18px] w-[18px] transition-colors',
                        isActive
                          ? 'text-lime-400'
                          : 'text-neutral-500 group-hover:text-neutral-100'
                      )}
                      strokeWidth={isActive ? 2.5 : 1.75}
                    />
                  </Link>
                }
              />
              <TooltipContent
                side="right"
                className="border border-white/10 bg-neutral-900 text-neutral-100 text-xs"
              >
                {label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      {/* Bottom: active indicator dot */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 ring-1 ring-white/10">
        <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_6px_oklch(0.88_0.234_128.48)]" />
      </div>
    </aside>
  )
}
