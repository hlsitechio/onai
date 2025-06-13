
import React from 'react';

const TiptapEmptyState: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mb-6 opacity-60">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-noteflow-400 to-noteflow-600 flex items-center justify-center">
            <span className="text-2xl">✨</span>
          </div>
        </div>
        <h3 className="text-xl font-medium text-white mb-3">
          Start writing with AI assistance
        </h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Use the toolbar above for formatting, select text for AI enhancements, or press Ctrl+Shift+A for the AI agent.
        </p>
        <div className="text-xs text-slate-500 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span>•</span>
            <span>Select text to see AI options</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>•</span>
            <span>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-noteflow-200">Ctrl+Shift+A</kbd> for AI Agent</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span>•</span>
            <span>Use formatting buttons in the toolbar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiptapEmptyState;
