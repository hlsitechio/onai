
import React from 'react';
import { cn } from '@/lib/utils';
import { ToolbarSection, ToolbarItem } from '../config/ToolbarConfig';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import ToolbarSeparator from './ToolbarSeparator';
import { getToolbarComponent } from './ToolbarComponentRegistry';

interface ToolbarRendererProps {
  sections: ToolbarSection[];
  editor: any;
  className?: string;
  variant?: 'horizontal' | 'vertical';
}

const ToolbarRenderer: React.FC<ToolbarRendererProps> = ({
  sections,
  editor,
  className,
  variant = 'horizontal'
}) => {
  const { isMobile, isTablet } = useDeviceDetection();

  const shouldHideItem = (item: ToolbarItem): boolean => {
    if (!item.responsive) return false;
    if (isMobile && item.responsive.hideOnMobile) return true;
    if (isTablet && item.responsive.hideOnTablet) return true;
    return false;
  };

  const renderItem = (item: ToolbarItem, sectionId: string) => {
    if (shouldHideItem(item)) return null;

    switch (item.type) {
      case 'separator':
        return <ToolbarSeparator key={item.id} />;
      
      case 'button':
      case 'dropdown':
      case 'group':
        const Component = getToolbarComponent(item.component);
        if (!Component) {
          console.warn(`Toolbar component '${item.component}' not found`);
          return null;
        }
        return (
          <Component
            key={item.id}
            editor={editor}
            {...(item.props || {})}
          />
        );
      
      default:
        return null;
    }
  };

  const sortedSections = sections.sort((a, b) => a.priority - b.priority);

  return (
    <div className={cn(
      "flex items-center gap-1",
      variant === 'vertical' && "flex-col",
      className
    )}>
      {sortedSections.map(section => (
        <div key={section.id} className="flex items-center gap-1">
          {section.items.map(item => renderItem(item, section.id))}
        </div>
      ))}
    </div>
  );
};

export default ToolbarRenderer;
