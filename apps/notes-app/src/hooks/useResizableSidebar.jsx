// Custom hook for resizable sidebar functionality
import { useState, useEffect, useCallback, useRef } from 'react';

export const useResizableSidebar = (initialWidth = 320, minWidth = 240, maxWidth = 600) => {
  const [sidebarWidth, setSidebarWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(initialWidth);

  // Load saved width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('onai-sidebar-width');
    if (savedWidth) {
      const width = parseInt(savedWidth, 10);
      if (width >= minWidth && width <= maxWidth) {
        setSidebarWidth(width);
      }
    }
  }, [minWidth, maxWidth]);

  // Save width to localStorage
  useEffect(() => {
    localStorage.setItem('onai-sidebar-width', sidebarWidth.toString());
  }, [sidebarWidth]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    
    // Add cursor style to body
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startXRef.current;
    const newWidth = startWidthRef.current + deltaX;
    
    // Constrain width within bounds
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setSidebarWidth(constrainedWidth);
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Touch events for mobile support
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.touches[0].clientX;
    startWidthRef.current = sidebarWidth;
  }, [sidebarWidth]);

  const handleTouchMove = useCallback((e) => {
    if (!isResizing) return;
    
    const deltaX = e.touches[0].clientX - startXRef.current;
    const newWidth = startWidthRef.current + deltaX;
    
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setSidebarWidth(constrainedWidth);
  }, [isResizing, minWidth, maxWidth]);

  const handleTouchEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add global event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Reset to default width
  const resetWidth = useCallback(() => {
    setSidebarWidth(initialWidth);
  }, [initialWidth]);

  // Collapse/expand sidebar
  const toggleCollapse = useCallback(() => {
    setSidebarWidth(prev => prev === minWidth ? initialWidth : minWidth);
  }, [minWidth, initialWidth]);

  return {
    sidebarWidth,
    isResizing,
    sidebarRef,
    handleMouseDown,
    handleTouchStart,
    resetWidth,
    toggleCollapse,
    minWidth,
    maxWidth
  };
};

// Resizable Sidebar Component
export const ResizableSidebar = ({ 
  children, 
  isOpen = true, 
  className = '',
  initialWidth = 320,
  minWidth = 240,
  maxWidth = 600,
  onWidthChange
}) => {
  const {
    sidebarWidth,
    isResizing,
    sidebarRef,
    handleMouseDown,
    handleTouchStart
  } = useResizableSidebar(initialWidth, minWidth, maxWidth);

  // Notify parent of width changes
  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(sidebarWidth);
    }
  }, [sidebarWidth, onWidthChange]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      ref={sidebarRef}
      className={`relative ${className}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Sidebar Content */}
      <div className="h-full overflow-hidden">
        {children}
      </div>
      
      {/* Resize Handle */}
      <div
        className={`absolute top-0 right-0 w-1 h-full cursor-col-resize group hover:w-2 transition-all duration-200 ${
          isResizing ? 'bg-purple-500' : 'bg-transparent hover:bg-purple-500/50'
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Visual resize indicator */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isResizing ? 'opacity-100' : ''
        }`} />
        
        {/* Resize dots indicator */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
          <div className={`w-3 h-8 bg-black/50 backdrop-blur-sm rounded-full flex flex-col items-center justify-center space-y-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            isResizing ? 'opacity-100' : ''
          }`}>
            <div className="w-0.5 h-0.5 bg-white/60 rounded-full"></div>
            <div className="w-0.5 h-0.5 bg-white/60 rounded-full"></div>
            <div className="w-0.5 h-0.5 bg-white/60 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default useResizableSidebar;

