import { Sparkles, CalendarClock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface AssetModalProps {
  children: React.ReactElement // changed from ReactNode for Base UI render prop type
  assetName: string
}

export function AssetModal({ children, assetName }: AssetModalProps) {
  return (
    <Dialog>
      <DialogTrigger render={children} />
      
      {/* max-w-4xl ensures a nice wide modal for the 2-column split */}
      <DialogContent className="max-w-4xl gap-0 border-neutral-200 bg-white p-0 outline-none sm:rounded-2xl dark:border-neutral-800 dark:bg-[oklch(0.09_0_0)]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Panel: Preview Area */}
          <div className="flex flex-col border-b border-neutral-200 bg-neutral-50/50 p-6 md:border-b-0 md:border-r dark:border-neutral-800 dark:bg-neutral-950/50">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
                ASSET PREVIEW
              </DialogTitle>
            </DialogHeader>
            <div className="relative isolate flex aspect-4/5 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-inner dark:border-neutral-800 dark:bg-neutral-900">
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="z-10 mt-auto w-full p-4">
                <p className="truncate text-center text-xs font-bold text-white dark:text-neutral-400">
                  {assetName}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Editor Area */}
          <div className="flex flex-col p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-sm font-extrabold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
                POSTING DETAILS
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-1 flex-col justify-between gap-6">
              
              <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2.5">
                  <Label htmlFor="title" className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    ASSET TITLE
                  </Label>
                  <Input
                    id="title"
                    defaultValue={assetName}
                    className="h-10 border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 focus-visible:border-lime-500 focus-visible:ring-lime-400/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus-visible:border-lime-400/50"
                  />
                </div>

                {/* Caption Textarea */}
                <div className="space-y-2.5">
                  <Label htmlFor="caption" className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    INSTAGRAM CAPTION
                  </Label>
                  <Textarea
                    id="caption"
                    placeholder="Write a compelling caption..."
                    className="min-h-[140px] resize-none border-neutral-200 bg-neutral-50 p-3 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus-visible:border-lime-500 focus-visible:ring-lime-400/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus-visible:border-lime-400/50"
                  />
                  
                  {/* GENERATE AI BUTTON */}
                  <Button
                    variant="outline"
                    className="group mt-2 h-9 w-full border-lime-400/60 bg-transparent text-[10px] font-bold tracking-widest text-lime-600 transition-all hover:bg-lime-50 hover:text-lime-700 focus-visible:ring-lime-400/30 dark:border-lime-400/30 dark:text-lime-400 dark:hover:bg-lime-400/10 dark:hover:text-lime-300"
                  >
                    <Sparkles className="mr-2 h-3.5 w-3.5" strokeWidth={2.5} />
                    GENERATE CAPTION WITH AI
                  </Button>
                </div>

                {/* Date & Time Picker */}
                <div className="space-y-2.5">
                  <Label htmlFor="scheduled_at" className="flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                     <CalendarClock className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
                     SCHEDULE TIME
                  </Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    className="h-10 border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-900 focus-visible:border-lime-500 focus-visible:ring-lime-400/20 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:focus-visible:border-lime-400/50 dark:[&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>

              {/* Main Submit Button */}
              <div className="mt-8">
                <Button className="h-12 w-full bg-lime-400 text-xs font-extrabold tracking-widest text-neutral-950 shadow-[0_0_20px_oklch(0.88_0.234_128.48/20%)] transition-all hover:bg-lime-300 hover:shadow-[0_0_30px_oklch(0.88_0.234_128.48/40%)]">
                  SAVE AND SCHEDULE
                </Button>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
