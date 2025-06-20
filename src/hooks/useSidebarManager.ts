
import { useState } from 'react';

export const useSidebarManager = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAISidebarVisible, setIsAISidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const toggleAISidebar = () => {
    setIsAISidebarVisible(prev => !prev);
  };

  const collapseSidebar = () => {
    setIsSidebarCollapsed(true);
  };

  const expandSidebar = () => {
    setIsSidebarCollapsed(false);
  };

  const showAISidebar = () => {
    setIsAISidebarVisible(true);
  };

  const hideAISidebar = () => {
    setIsAISidebarVisible(false);
  };

  return {
    isSidebarCollapsed,
    isAISidebarVisible,
    toggleSidebar,
    toggleAISidebar,
    collapseSidebar,
    expandSidebar,
    showAISidebar,
    hideAISidebar
  };
};
