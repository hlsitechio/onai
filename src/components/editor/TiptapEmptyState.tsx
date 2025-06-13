
import React from 'react';

const TiptapEmptyState: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md px-6">
          <div className="mb-4 opacity-60">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-noteflow-400 to-noteflow-600 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Start writing with AI assistance
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Use the toolbar above for formatting, select text for AI enhancements, or press Ctrl+Shift+A for the AI agent.
          </p>
          <div className="text-xs text-slate-500 space-y-1">
            <div>• Select text to see AI options</div>
            <div>• Press <kbd className="bg-white/10 px-1 rounded">Ctrl+Shift+A</kbd> for AI Agent</div>
            <div>• Use formatting buttons in the toolbar</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEmptyState;
