import React from 'react';
import { Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DividerControls: React.FC = () => {
  const insertDivider = () => {
    try {
      const dividerHtml = `<hr style="border: none; border-top: 2px solid #374151; margin: 2rem 0;" />`;
      document.execCommand('insertHTML', false, dividerHtml);
    } catch {
      document.execCommand('insertHTML', false, '<hr>');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={insertDivider}
      className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      title="Insert Divider"
    >
      <Minus className="h-4 w-4" />
    </Button>
  );
};

export default DividerControls;
