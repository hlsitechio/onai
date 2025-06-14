
import { GripVertical } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

const ResizablePanel = ResizablePrimitive.Panel

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-3 items-center justify-center bg-transparent hover:bg-purple-500/20 transition-all duration-200 cursor-col-resize group",
      "before:absolute before:inset-0 before:w-6 before:bg-transparent before:-translate-x-1/2 before:left-1/2 before:hover:bg-purple-500/10",
      "after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2 after:bg-white/30 after:rounded-full after:opacity-100 after:transition-all after:duration-200 group-hover:after:opacity-100 group-hover:after:bg-purple-500/80 group-hover:after:w-1",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-3 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
      "data-[panel-group-direction=vertical]:before:h-6 data-[panel-group-direction=vertical]:before:w-full data-[panel-group-direction=vertical]:before:left-0 data-[panel-group-direction=vertical]:before:-translate-y-1/2 data-[panel-group-direction=vertical]:before:top-1/2",
      "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-0.5 data-[panel-group-direction=vertical]:after:w-full",
      "data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:top-1/2",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      "hover:w-4 data-[panel-group-direction=vertical]:hover:h-4",
      "border-x border-white/5 hover:border-purple-500/30",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-16 w-5 items-center justify-center rounded bg-white/5 hover:bg-purple-500/30 transition-all duration-200 border border-white/20 group-hover:border-purple-500/60 shadow-lg opacity-100 transform scale-90 group-hover:scale-100">
        <GripVertical className="h-5 w-4 text-white/50 group-hover:text-purple-200 transition-colors duration-200" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
