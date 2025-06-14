
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
      "relative flex w-2 items-center justify-center bg-transparent transition-all duration-200 group",
      "hover:bg-purple-500/20 hover:w-3 active:bg-purple-500/30 active:w-4",
      "cursor-col-resize data-[panel-group-direction=vertical]:cursor-row-resize",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full",
      "data-[panel-group-direction=vertical]:hover:h-3 data-[panel-group-direction=vertical]:active:h-4",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      "border-l border-r border-white/5 hover:border-white/20",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-8 w-3 items-center justify-center rounded-sm bg-white/5 hover:bg-purple-500/30 transition-all duration-200 opacity-40 hover:opacity-100 active:opacity-100 active:bg-purple-500/50 group-hover:shadow-lg">
        <GripVertical className="h-3 w-2 text-white/40 group-hover:text-purple-200 transition-colors duration-200" />
      </div>
    )}
    
    {/* Enhanced resize indicator line */}
    <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/10 group-hover:bg-purple-500/60 group-active:bg-purple-500 transition-all duration-200 data-[panel-group-direction=vertical]:inset-x-0 data-[panel-group-direction=vertical]:top-1/2 data-[panel-group-direction=vertical]:h-0.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:-translate-y-1/2 data-[panel-group-direction=vertical]:translate-x-0 group-hover:shadow-glow"></div>
    
    {/* Invisible wider hit area for easier grabbing */}
    <div className="absolute inset-y-0 -left-2 -right-2 cursor-col-resize data-[panel-group-direction=vertical]:cursor-row-resize data-[panel-group-direction=vertical]:inset-x-0 data-[panel-group-direction=vertical]:-top-2 data-[panel-group-direction=vertical]:-bottom-2"></div>
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
