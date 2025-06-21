
import React, { useState } from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Sparkles,
  Wand2,
  Languages,
  FileText,
  Lightbulb,
  ArrowRight,
  Loader2,
  Bold,
  Italic,
  Underline,
  Code
} from 'lucide-react';
import { callGeminiAI } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';

interface AIEnhancedBubbleMenuProps {
  editor: Editor;
  selectedText: string;
}

const AIEnhancedBubbleMenu: React.FC<AIEnhancedBubbleMenuProps> = ({ editor, selectedText }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleAIAction = async (action: string, prompt: string) => {
    if (!selectedText.trim()) return;

    setIsProcessing(true);
    setIsAIMenuOpen(false);

    try {
      const response = await callGeminiAI(prompt, selectedText, action as any);
      
      // Replace selected text with AI result
      const { from, to } = editor.state.selection;
      editor.chain().focus().setTextSelection({ from, to }).insertContent(response).run();
      
      toast({
        title: 'Text enhanced',
        description: `AI has ${action === 'improve' ? 'improved' : 'processed'} your selected text.`,
      });
    } catch (error) {
      console.error('AI action failed:', error);
      toast({
        title: 'AI action failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueWriting = async () => {
    setIsProcessing(true);
    
    try {
      const contextText = selectedText || editor.getText().slice(-200);
      const response = await callGeminiAI(
        `Continue this text naturally and coherently: "${contextText}"`,
        editor.getHTML(),
        'ideas'
      );
      
      // Insert continuation after selection or at cursor
      const { to } = editor.state.selection;
      editor.chain().focus().setTextSelection(to).insertContent(` ${response}`).run();
      
      toast({
        title: 'Text continued',
        description: 'AI has continued your writing.',
      });
    } catch (error) {
      console.error('Continue writing failed:', error);
      toast({
        title: 'Continue writing failed',
        description: 'Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const quickActions = [
    {
      icon: Wand2,
      label: 'Improve',
      action: () => handleAIAction('improve', `Improve and enhance this text while keeping the same meaning: "${selectedText}"`),
      color: 'text-blue-400'
    },
    {
      icon: FileText,
      label: 'Summarize',
      action: () => handleAIAction('summarize', `Summarize this text concisely: "${selectedText}"`),
      color: 'text-green-400'
    },
    {
      icon: Languages,
      label: 'Translate',
      action: () => handleAIAction('translate', `Translate this text to Spanish: "${selectedText}"`),
      color: 'text-purple-400'
    },
    {
      icon: Lightbulb,
      label: 'Expand',
      action: () => handleAIAction('ideas', `Expand on this idea with more details and examples: "${selectedText}"`),
      color: 'text-yellow-400'
    }
  ];

  if (!selectedText) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ 
        duration: 100,
        placement: 'top',
        offset: [0, 10]
      }}
      className="flex items-center gap-1 p-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl"
    >
      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-white/20 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-white/20 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-white/20 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('code') ? 'bg-white/20 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 bg-white/20" />

      {/* AI Quick Actions */}
      {quickActions.map((quickAction, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={quickAction.action}
          disabled={isProcessing}
          className={`h-8 px-2 text-xs ${quickAction.color} hover:bg-white/10 disabled:opacity-50`}
          title={quickAction.label}
        >
          {isProcessing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <quickAction.icon className="h-3 w-3" />
          )}
        </Button>
      ))}

      <Separator orientation="vertical" className="h-6 bg-white/20" />

      {/* Continue Writing */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleContinueWriting}
        disabled={isProcessing}
        className="h-8 px-2 text-xs text-noteflow-400 hover:text-noteflow-300 hover:bg-white/10 disabled:opacity-50"
        title="Continue writing"
      >
        {isProcessing ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <>
            <ArrowRight className="h-3 w-3 mr-1" />
            Continue
          </>
        )}
      </Button>

      {/* Advanced AI Menu */}
      <Popover open={isAIMenuOpen} onOpenChange={setIsAIMenuOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-noteflow-400 hover:text-noteflow-300 hover:bg-white/10"
            title="More AI options"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-48 p-2 bg-black/95 backdrop-blur-xl border border-white/20 shadow-2xl"
          side="bottom"
          align="end"
        >
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('analyze', `Analyze this text and provide insights: "${selectedText}"`)}
              className="w-full justify-start text-white hover:bg-white/10 h-8"
            >
              <FileText className="h-4 w-4 mr-2" />
              Analyze
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('translate', `Translate this text to French: "${selectedText}"`)}
              className="w-full justify-start text-white hover:bg-white/10 h-8"
            >
              <Languages className="h-4 w-4 mr-2" />
              Translate to French
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('improve', `Rewrite this text in a more formal tone: "${selectedText}"`)}
              className="w-full justify-start text-white hover:bg-white/10 h-8"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Make Formal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAIAction('improve', `Rewrite this text in a more casual tone: "${selectedText}"`)}
              className="w-full justify-start text-white hover:bg-white/10 h-8"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Make Casual
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </BubbleMenu>
  );
};

export default AIEnhancedBubbleMenu;
