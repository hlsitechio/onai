
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
      "relative flex w-1 items-center justify-center bg-transparent transition-all duration-150 group",
      "hover:bg-purple-500/30 hover:w-2 active:bg-purple-500/40 active:w-3",
      "cursor-col-resize data-[panel-group-direction=vertical]:cursor-row-resize",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-full",
      "data-[panel-group-direction=vertical]:hover:h-2 data-[panel-group-direction=vertical]:active:h-3",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      "border-l border-r border-white/10 hover:border-white/30",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-8 w-2 items-center justify-center rounded-sm bg-white/10 hover:bg-purple-500/40 transition-all duration-150 opacity-60 hover:opacity-100 active:opacity-100 active:bg-purple-500/60 group-hover:shadow-lg">
        <GripVertical className="h-3 w-1.5 text-white/60 group-hover:text-purple-200 transition-colors duration-150" />
      </div>
    )}
    
    {/* Enhanced resize indicator line */}
    <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/20 group-hover:bg-purple-500/70 group-active:bg-purple-500/90 transition-all duration-150 data-[panel-group-direction=vertical]:inset-x-0 data-[panel-group-direction=vertical]:top-1/2 data-[panel-group-direction=vertical]:h-0.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:-translate-y-1/2 data-[panel-group-direction=vertical]:translate-x-0 group-hover:shadow-glow"></div>
    
    {/* Wider invisible hit area for easier grabbing */}
    <div className="absolute inset-y-0 -left-3 -right-3 cursor-col-resize data-[panel-group-direction=vertical]:cursor-row-resize data-[panel-group-direction=vertical]:inset-x-0 data-[panel-group-direction=vertical]:-top-3 data-[panel-group-direction=vertical]:-bottom-3"></div>
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
