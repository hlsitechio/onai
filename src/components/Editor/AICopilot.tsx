
import React, { useState, useCallback } from 'react';
import { Bot, Languages, Lightbulb, Sparkles, X, Send, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AICopilotProps {
  selectedText: string;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

type AIAction = 'improve' | 'translate' | 'summarize' | 'expand' | 'simplify' | 'custom';

const languages = [
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ru', label: 'Russian' },
];

const AICopilot: React.FC<AICopilotProps> = ({
  selectedText,
  onTextInsert,
  onTextReplace,
  isVisible,
  onClose,
  position
}) => {
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const simulateAIResponse = useCallback(async (action: AIAction, text: string, extra?: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch (action) {
      case 'improve':
        return `Enhanced: ${text.charAt(0).toUpperCase() + text.slice(1)}. This improved version provides better clarity and flow while maintaining the original meaning.`;
      
      case 'translate':
        const langName = languages.find(l => l.value === extra)?.label || 'Spanish';
        return `[Translated to ${langName}]: ${text} (This is a simulated translation - in a real app, this would use a translation API)`;
      
      case 'summarize':
        return `Summary: ${text.split(' ').slice(0, Math.max(5, Math.floor(text.split(' ').length / 3))).join(' ')}...`;
      
      case 'expand':
        return `${text} Additionally, this concept can be further explored by considering various perspectives and implications. The expanded version provides more context and detail to help readers better understand the subject matter.`;
      
      case 'simplify':
        return `Simplified: ${text.split(' ').slice(0, Math.max(3, Math.floor(text.split(' ').length / 2))).join(' ')}.`;
      
      case 'custom':
        return `Custom response based on: "${extra}"\n\nProcessed text: ${text}\n\nThis is a simulated AI response that would normally be generated based on your custom prompt.`;
      
      default:
        return text;
    }
  }, []);

  const handleAction = async (action: AIAction) => {
    if (!selectedText.trim() && action !== 'custom') {
      toast.error('Please select some text first');
      return;
    }

    setActiveAction(action);
    setIsProcessing(true);
    setResult('');

    try {
      let response: string;
      
      if (action === 'translate') {
        response = await simulateAIResponse(action, selectedText, targetLanguage);
      } else if (action === 'custom') {
        if (!customPrompt.trim()) {
          toast.error('Please enter a custom prompt');
          return;
        }
        response = await simulateAIResponse(action, selectedText || 'No text selected', customPrompt);
      } else {
        response = await simulateAIResponse(action, selectedText);
      }
      
      setResult(response);
      toast.success('AI processing completed!');
    } catch (error) {
      toast.error('AI processing failed. Please try again.');
      console.error('AI Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleInsert = () => {
    onTextInsert(result);
    toast.success('Text inserted!');
    onClose();
  };

  const handleReplace = () => {
    onTextReplace(result);
    toast.success('Text replaced!');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 w-80 animate-scale-in"
      style={{ 
        left: position?.x || '50%',
        top: position?.y || '50%',
        transform: position ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)'
      }}
    >
      <Card className="shadow-large border-2 bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              AI Writing Assistant
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {selectedText && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md mt-2">
              Selected: "{selectedText.slice(0, 50)}{selectedText.length > 50 ? '...' : ''}"
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Actions */}
          {!activeAction && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('improve')}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Improve</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveAction('translate')}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <Languages className="w-4 h-4" />
                <span className="text-xs">Translate</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('summarize')}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs">Summarize</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('expand')}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Expand</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('simplify')}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <Bot className="w-4 h-4" />
                <span className="text-xs">Simplify</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveAction('custom')}
                className="h-auto p-3 flex flex-col items-center gap-1"
              >
                <Send className="w-4 h-4" />
                <span className="text-xs">Custom</span>
              </Button>
            </div>
          )}

          {/* Translation Options */}
          {activeAction === 'translate' && !result && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Language</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleAction('translate')} disabled={isProcessing} className="w-full">
                {isProcessing ? 'Translating...' : 'Translate Text'}
              </Button>
            </div>
          )}

          {/* Custom Prompt */}
          {activeAction === 'custom' && !result && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Custom Instructions</label>
                <Textarea
                  placeholder="Tell the AI what you want to do with the text..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <Button onClick={() => handleAction('custom')} disabled={isProcessing || !customPrompt.trim()} className="w-full">
                {isProcessing ? 'Processing...' : 'Process Text'}
              </Button>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="w-4 h-4 animate-pulse" />
                <span>AI is processing...</span>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">AI Result</Badge>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md text-sm max-h-40 overflow-y-auto">
                {result}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" onClick={handleInsert} className="flex-1">
                  Insert Below
                </Button>
                {selectedText && (
                  <Button size="sm" variant="outline" onClick={handleReplace} className="flex-1">
                    Replace Selected
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Back Button */}
          {activeAction && !isProcessing && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setActiveAction(null);
                setResult('');
                setCustomPrompt('');
              }}
              className="w-full"
            >
              ← Back to Actions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AICopilot;
