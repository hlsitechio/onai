
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles,
  Loader2,
  Square,
  FileText,
  Languages,
  Lightbulb,
  FileImage,
  CornerDownRight,
  X
} from 'lucide-react';

interface AIProcessingAreaProps {
  content: string;
  result: string;
  streamingResult: string;
  onProcess: (action: string, customPrompt?: string, targetLanguage?: string) => void;
  onClearResult: () => void;
  onStopProcessing: () => void;
  onApplyChanges: (newContent: string) => void;
  isProcessing: boolean;
}

const AIProcessingArea: React.FC<AIProcessingAreaProps> = ({
  content,
  result,
  streamingResult,
  onProcess,
  onClearResult,
  onStopProcessing,
  onApplyChanges,
  isProcessing
}) => {
  const [selectedAction, setSelectedAction] = useState('analyze');
  const [customPrompt, setCustomPrompt] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('French');

  const aiActions = [
    { value: 'analyze', label: 'Analyze', icon: Lightbulb },
    { value: 'ideas', label: 'Generate Ideas', icon: Sparkles },
    { value: 'improve', label: 'Improve Writing', icon: FileText },
    { value: 'translate', label: 'Translate', icon: Languages },
    { value: 'summarize', label: 'Summarize', icon: FileText }
  ];

  const languages = [
    'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Russian',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch'
  ];

  const handleProcess = () => {
    onProcess(selectedAction, customPrompt, targetLanguage);
  };

  const displayText = streamingResult || result;
  const canApply = result && !isProcessing && ['improve', 'translate', 'summarize'].includes(selectedAction);

  return (
    <div className="space-y-4">
      {/* Action Selector */}
      <div>
        <label className="text-xs text-slate-300 block mb-2">AI Action:</label>
        <Select value={selectedAction} onValueChange={setSelectedAction}>
          <SelectTrigger className="bg-black/30 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black/95 border-white/20">
            {aiActions.map((action) => {
              const Icon = action.icon;
              return (
                <SelectItem key={action.value} value={action.value} className="text-white">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Language Selector for Translation */}
      {selectedAction === 'translate' && (
        <div>
          <label className="text-xs text-slate-300 block mb-2">Target Language:</label>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="bg-black/30 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/95 border-white/20">
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang} className="text-white">
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Custom Prompt */}
      <div>
        <label className="text-xs text-slate-300 block mb-2">Custom Prompt (Optional):</label>
        <Textarea 
          placeholder="Enter a custom prompt to guide the AI..." 
          value={customPrompt} 
          onChange={(e) => setCustomPrompt(e.target.value)} 
          className="h-16 text-xs resize-none bg-black/30 border-white/10 text-white" 
        />
      </div>

      {/* Process Button */}
      <div className="flex gap-2">
        <Button 
          onClick={handleProcess} 
          disabled={isProcessing || !content.trim()} 
          className="bg-noteflow-500 hover:bg-noteflow-600 text-white flex-1"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Process with AI
            </>
          )}
        </Button>

        {isProcessing && (
          <Button 
            onClick={onStopProcessing} 
            variant="outline" 
            className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20" 
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Results Area */}
      {displayText && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">
              {isProcessing ? "Generating..." : "Result:"}
            </h4>
            {result && !isProcessing && (
              <Button 
                onClick={onClearResult} 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs text-slate-400 hover:text-white"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          <div className="relative">
            <Textarea 
              value={displayText} 
              readOnly 
              className={`h-32 resize-none bg-black/30 border-white/10 text-white text-sm ${
                isProcessing ? 'animate-pulse' : ''
              }`} 
              placeholder={isProcessing ? "AI is typing..." : "Result will appear here..."} 
            />
            
            {isProcessing && (
              <div className="absolute bottom-2 right-2">
                <div className="flex items-center gap-1 text-xs text-noteflow-400">
                  <div className="w-1 h-1 bg-noteflow-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-noteflow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-noteflow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Apply Changes Button */}
          {canApply && (
            <Button 
              onClick={() => onApplyChanges(result)} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CornerDownRight className="h-4 w-4 mr-2" />
              Apply Changes to Note
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AIProcessingArea;
