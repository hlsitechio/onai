
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, CornerDownRight } from "lucide-react";

interface AIResultsDisplayProps {
  result: string;
  selectedAction: string;
  onClearResult: () => void;
  onApplyChanges: () => void;
}

const AIResultsDisplay: React.FC<AIResultsDisplayProps> = ({
  result,
  selectedAction,
  onClearResult,
  onApplyChanges
}) => {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">AI Results</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearResult}
          className="h-6 text-xs text-slate-400 hover:text-white"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
      <div className="bg-black/40 border border-white/10 rounded-md p-3 text-xs text-white overflow-y-auto max-h-40">
        <div className="whitespace-pre-wrap">{result}</div>
      </div>
      {["improve", "translate", "summarize"].includes(selectedAction) && (
        <Button 
          onClick={onApplyChanges}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <CornerDownRight className="h-3 w-3 mr-1" />
          Apply to Note
        </Button>
      )}
    </div>
  );
};

export default AIResultsDisplay;
