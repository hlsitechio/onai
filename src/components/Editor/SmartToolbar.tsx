
import React from 'react';
import { 
  Bold, Italic, Underline, Code, List, ListOrdered, Quote, 
  Heading1, Heading2, Bot, Sparkles, Type, Palette, Zap,
  AlignLeft, AlignCenter, AlignRight, Link, Image, Table
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface SmartToolbarProps {
  onFormatClick: (format: string, event: React.MouseEvent) => void;
  onAIClick: () => void;
  activeFormats: Set<string>;
  selectedText: string;
}

const SmartToolbar: React.FC<SmartToolbarProps> = ({
  onFormatClick,
  onAIClick,
  activeFormats,
  selectedText
}) => {
  const formatGroups = [
    {
      name: 'Text Formatting',
      items: [
        { id: 'bold', icon: Bold, tooltip: 'Bold (Ctrl+B)' },
        { id: 'italic', icon: Italic, tooltip: 'Italic (Ctrl+I)' },
        { id: 'underline', icon: Underline, tooltip: 'Underline (Ctrl+U)' },
        { id: 'code', icon: Code, tooltip: 'Inline Code (Ctrl+`)' }
      ]
    },
    {
      name: 'Structure',
      items: [
        { id: 'heading-one', icon: Heading1, tooltip: 'Heading 1' },
        { id: 'heading-two', icon: Heading2, tooltip: 'Heading 2' },
        { id: 'block-quote', icon: Quote, tooltip: 'Quote Block' }
      ]
    },
    {
      name: 'Lists',
      items: [
        { id: 'bulleted-list', icon: List, tooltip: 'Bullet List' },
        { id: 'numbered-list', icon: ListOrdered, tooltip: 'Numbered List' }
      ]
    },
    {
      name: 'Advanced',
      items: [
        { id: 'align-left', icon: AlignLeft, tooltip: 'Align Left' },
        { id: 'align-center', icon: AlignCenter, tooltip: 'Align Center' },
        { id: 'align-right', icon: AlignRight, tooltip: 'Align Right' }
      ]
    }
  ];

  return (
    <div className="flex items-center justify-between p-4 border-b-2 border-gradient-to-r from-blue-100 to-purple-100 bg-gradient-to-r from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="flex items-center gap-1">
        {formatGroups.map((group, groupIndex) => (
          <React.Fragment key={group.name}>
            {groupIndex > 0 && <Separator orientation="vertical" className="h-6 mx-2" />}
            <div className="flex items-center gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeFormats.has(item.id);
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    className={`relative transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onMouseDown={(event) => onFormatClick(item.id, event)}
                    title={item.tooltip}
                  >
                    <Icon className="w-4 h-4" />
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                  </Button>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex items-center gap-3">
        {selectedText && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
            {selectedText.length} chars selected
          </Badge>
        )}
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          onClick={onAIClick}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
          AI Assistant
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="border-2 border-purple-200 hover:bg-purple-50 text-purple-600 hover:text-purple-700"
        >
          <Zap className="w-4 h-4 mr-1" />
          Pro
        </Button>
      </div>
    </div>
  );
};

export default SmartToolbar;
