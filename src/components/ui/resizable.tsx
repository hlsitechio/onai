
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
      "relative flex w-2 items-center justify-center bg-transparent transition-all duration-150 group",
      "hover:bg-purple-500/20 hover:w-3 active:bg-purple-500/30 active:w-4",
      "cursor-col-resize data-[panel-group-direction=vertical]:cursor-row-resize",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full",
      "data-[panel-group-direction=vertical]:hover:h-3 data-[panel-group-direction=vertical]:active:h-4",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-10 w-3 items-center justify-center rounded-sm bg-white/5 hover:bg-purple-500/20 transition-all duration-150 opacity-40 hover:opacity-80 active:opacity-100 active:bg-purple-500/40 group-hover:shadow-lg">
        <GripVertical className="h-4 w-2 text-white/40 group-hover:text-purple-200 transition-colors duration-150" />
      </div>
    )}
    
    {/* Enhanced resize indicator line */}
    <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-white/10 group-hover:bg-purple-500/50 group-active:bg-purple-500/70 transition-all duration-150 data-[panel-group-direction=vertical]:inset-x-0 data-[panel-group-direction=vertical]:top-1/2 data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:-translate-y-1/2 data-[panel-group-direction=vertical]:translate-x-0 group-hover:shadow-glow"></div>
    
    {/* Wider invisible hit area for easier grabbing */}
    <div className="absolute inset-y-0 -left-4 -right-4 cursor-col-resize data-[panel-group-direction=vertical]:cursor-row-resize data-[panel-group-direction=vertical]:inset-x-0 data-[panel-group-direction=vertical]:-top-4 data-[panel-group-direction=vertical]:-bottom-4"></div>
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
