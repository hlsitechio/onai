
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
      "relative flex w-2 items-center justify-center bg-white/5 hover:bg-purple-500/30 transition-all duration-200 cursor-col-resize group border-x border-white/10",
      "hover:w-3 hover:border-purple-500/50",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1",
      "data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
      "data-[panel-group-direction=vertical]:hover:h-3 data-[panel-group-direction=vertical]:border-y data-[panel-group-direction=vertical]:border-x-0",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      "shadow-lg",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-12 w-4 items-center justify-center rounded bg-white/10 hover:bg-purple-500/40 transition-all duration-200 border border-white/30 group-hover:border-purple-500/80 shadow-lg opacity-100 transform scale-100 group-hover:scale-110">
        <GripVertical className="h-4 w-3 text-white/70 group-hover:text-purple-200 transition-colors duration-200" />
      </div>
    )}
    
    {/* Always visible resize indicator line */}
    <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/20 group-hover:bg-purple-500/60 transition-all duration-200 data-[panel-group-direction=vertical]:inset-x-0 data-[panel-group-direction=vertical]:top-1/2 data-[panel-group-direction=vertical]:h-0.5 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:-translate-y-1/2 data-[panel-group-direction=vertical]:translate-x-0"></div>
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
