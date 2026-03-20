import { TooltipProvider } from '@/components/ui/tooltip'
import Sidebar from '@/components/dashboard/sidebar'
import DashboardHeader from '@/components/dashboard/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-[oklch(0.09_0_0)]">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main content: offset by sidebar width (68px) */}
        <div className="flex flex-1 flex-col pl-[68px]">
          <DashboardHeader />

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
