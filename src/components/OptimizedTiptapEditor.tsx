
import React from 'react';
import LazyLoader from '@/components/LazyLoader';
import { lazyComponents } from '@/utils/bundleOptimization';

interface OptimizedTiptapEditorProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
}

const OptimizedTiptapEditor: React.FC<OptimizedTiptapEditorProps> = (props) => {
  return (
    <LazyLoader
      component={lazyComponents.TiptapEditor}
      props={props}
      fallback={
        <div className="h-full flex items-center justify-center bg-black/20 rounded-lg">
          <div className="text-center space-y-4">
            <div className="w-6 h-6 border-2 border-noteflow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm">Loading editor...</p>
          </div>
        </div>
      }
    />
  );
};

export default OptimizedTiptapEditor;
