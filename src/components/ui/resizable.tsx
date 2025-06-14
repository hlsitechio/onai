
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
      "relative flex w-3 items-center justify-center bg-white/10 hover:bg-purple-500/40 transition-all duration-200 cursor-col-resize group border-x border-white/20",
      "hover:w-4 hover:border-purple-500/60",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-3 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
      "data-[panel-group-direction=vertical]:hover:h-4 data-[panel-group-direction=vertical]:border-y data-[panel-group-direction=vertical]:border-x-0",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      "shadow-lg z-50",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-16 w-4 items-center justify-center rounded bg-white/20 hover:bg-purple-500/50 transition-all duration-200 border border-white/40 group-hover:border-purple-500/80 shadow-lg opacity-100 transform scale-100 group-hover:scale-110">
        <GripVertical className="h-5 w-4 text-white/80 group-hover:text-purple-200 transition-colors duration-200" />
      </div>
    )}
    
    {/* Enhanced resize indicator line */}
    <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-white/30 group-hover:bg-purple-500/70 transition-all duration-200 data-[panel-group-direction=vertical]:inset-x-0 data-[panel-group-direction=vertical]:top-1/2 data-[panel-group-direction=vertical]:h-1 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:-translate-y-1/2 data-[panel-group-direction=vertical]:translate-x-0"></div>
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
