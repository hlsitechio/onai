
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Languages, 
  PenTool, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Smile,
  Loader2,
  Copy,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTextAIProcessor } from '@/hooks/useTextAIProcessor';

interface TextAIProcessorProps {
  initialText?: string;
  onTextChange?: (text: string) => void;
  className?: string;
}

const TextAIProcessor: React.FC<TextAIProcessorProps> = ({
  initialText = '',
  onTextChange,
  className = ''
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [selectedLanguage, setSelectedLanguage] = useState('Spanish');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [selectedSize, setSelectedSize] = useState('shorter');
  
  const { toast } = useToast();
  const {
    isProcessing,
    result,
    processText,
    clearResult,
    copyToClipboard,
    applyResult
  } = useTextAIProcessor({ onTextChange });

  const handleProcess = async (action: string) => {
    if (!inputText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }

    const options = {
      language: selectedLanguage,
      style: selectedStyle,
      tone: selectedTone,
      size: selectedSize
    };

    await processText(action, inputText, options);
  };

  const aiActions = [
    {
      id: 'translate',
      label: 'Translate',
      icon: Languages,
      color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: `Translate to ${selectedLanguage}`
    },
    {
      id: 'rewrite',
      label: 'Rewrite Style',
      icon: PenTool,
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: `Rewrite in ${selectedStyle} style`
    },
    {
      id: 'resize',
      label: 'Resize Text',
      icon: selectedSize === 'shorter' ? Minimize2 : Maximize2,
      color: 'bg-green-500/20 text-green-300 border-green-500/30',
      description: `Make text ${selectedSize}`
    },
    {
      id: 'summarize',
      label: 'Summarize',
      icon: FileText,
      color: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      description: 'Create a concise summary'
    },
    {
      id: 'tone',
      label: 'Change Tone',
      icon: Smile,
      color: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      description: `Make it ${selectedTone}`
    }
  ];

  return (
    <Card className={`bg-black/40 backdrop-blur-lg border-white/10 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-noteflow-400" />
          AI Text Processor
          <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
            Enhanced
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input Text Area */}
        <div>
          <label className="text-sm text-slate-300 block mb-2">Input Text</label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to process with AI..."
            className="bg-black/30 border-white/10 text-white min-h-[120px] resize-none"
          />
        </div>

        {/* Action Options */}
        <div className="grid grid-cols-2 gap-3">
          {/* Translation Language */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Translate to:</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="h-8 text-xs bg-black/30 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-lg border-white/10 text-white">
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Korean">Korean</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Writing Style */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Writing Style:</label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="h-8 text-xs bg-black/30 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-lg border-white/10 text-white">
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="journalistic">Journalistic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Text Tone */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Tone:</label>
            <Select value={selectedTone} onValueChange={setSelectedTone}>
              <SelectTrigger className="h-8 text-xs bg-black/30 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-lg border-white/10 text-white">
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="confident">Confident</SelectItem>
                <SelectItem value="empathetic">Empathetic</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Text Size */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Text Size:</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="h-8 text-xs bg-black/30 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-lg border-white/10 text-white">
                <SelectItem value="shorter">Shorter</SelectItem>
                <SelectItem value="longer">Longer</SelectItem>
                <SelectItem value="expanded">Expanded</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {aiActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={() => handleProcess(action.id)}
                disabled={isProcessing}
                className={`${action.color} hover:opacity-80 transition-opacity text-xs py-2 h-auto flex flex-col items-center gap-1`}
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
                <span className="text-xs opacity-70">{action.description}</span>
              </Button>
            );
          })}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-noteflow-400 mr-2" />
            <span className="text-sm text-slate-300">Processing with AI...</span>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">AI Result</h4>
              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-slate-400 hover:text-white"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button
                  onClick={applyResult}
                  size="sm"
                  className="h-7 text-xs bg-noteflow-500 hover:bg-noteflow-600"
                >
                  Apply
                </Button>
                <Button
                  onClick={clearResult}
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-slate-400 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Textarea
              value={result}
              readOnly
              className="bg-black/40 border-white/10 text-white min-h-[120px] resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextAIProcessor;
