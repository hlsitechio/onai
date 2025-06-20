import React from "react";
import { Bold, Italic, Save, Sparkles, Menu, Focus, PanelLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface MobileToolbarProps {
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleSidebar: () => void;
  toggleAI: () => void;
  isSidebarOpen: boolean;
  isAISidebarOpen?: boolean;
  isFocusMode?: boolean;
  toggleFocusMode?: () => void;
  onShowMore?: () => void;
}
const MobileToolbar: React.FC<MobileToolbarProps> = ({
  execCommand,
  handleSave,
  toggleSidebar,
  toggleAI,
  isSidebarOpen,
  isAISidebarOpen,
  isFocusMode = false,
  toggleFocusMode = () => {},
  onShowMore
}) => {
  return;
};
export default MobileToolbar;