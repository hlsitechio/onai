
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, InfoIcon, AlertTriangle, ShieldCheck, Square, FileImage, Bot, Wand2, FileText, MessageSquare, Lightbulb, TrendingUp, ChevronRight, Plus, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIDisclaimer from "./AIDisclaimer";
import AIActionSelector from "./AIActionSelector";
import ImageUploadArea from "./ImageUploadArea";
import OCRButton from "../ocr/OCRButton";
import OCRPopup from "../ocr/OCRPopup";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useQueuedStreamingAI } from "@/hooks/useQueuedStreamingAI";
import { getUsageStats, callGeminiAI } from "@/utils/aiUtils";

interface AISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
}

interface AISuggestion {
  id: string;
  type: 'enhance' | 'amplify' | 'suggest' | 'continue';
  content: string;
  position: number;
  isApplied: boolean;
}

type AIAction = "analyze" | "ideas" | "improve" | "translate" | "summarize" | "image_analyze";

const AISidebar: React.FC<AISidebarProps> = ({
  content,
  onApplyChanges,
  editorHeight
}) => {
  const [selectedAction, setSelectedAction] = useState<AIAction>("analyze");
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isOCROpen, setIsOCROpen] = useState(false);
  const [usageStats] = useState(() => getUsageStats());
  
  // AI Agent features
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isProcessingSuggestions, setIsProcessingSuggestions] = useState(false);
  const [showAIAgent, setShowAIAgent] = useState(false);

  const { toast } = useToast();
  
  const {
    uploadedImage,
    fileInputRef,
    handleImageUpload,
    removeUploadedImage
  } = useImageUpload();
  
  const {
    isLoading,
    isStreaming,
    queueSize,
    error,
    result,
    streamingResult,
    processStreamingAI,
    stopStreaming,
    clearResult
  } = useQueuedStreamingAI();

  // Generate AI suggestions
  const generateSuggestions = async () => {
    if (!content.trim()) {
      toast({
        title: "No content",
        description: "Please add some content to generate suggestions.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingSuggestions(true);
    try {
      const suggestions = await Promise.all([
        // Enhance suggestion
        callGeminiAI(
          `Enhance this text with better clarity and depth: "${content.slice(0, 200)}...". Provide a concise improvement (max 2 sentences).`,
          content,
          'improve'
        ),
        // Amplify idea suggestion
        callGeminiAI(
          `Amplify and expand on this idea: "${content.slice(0, 200)}...". Provide a creative extension (max 2 sentences).`,
          content,
          'ideas'
        ),
        // Continue suggestion
        callGeminiAI(
          `Continue this thought naturally: "${content.slice(0, 200)}...". Provide a logical next sentence or two.`,
          content,
          'ideas'
        )
      ]);

      const newSuggestions: AISuggestion[] = [
        {
          id: `enhance-${Date.now()}`,
          type: 'enhance',
          content: suggestions[0],
          position: content.length,
          isApplied: false
        },
        {
          id: `amplify-${Date.now()}`,
          type: 'amplify', 
          content: suggestions[1],
          position: content.length,
          isApplied: false
        },
        {
          id: `continue-${Date.now()}`,
          type: 'continue',
          content: suggestions[2],
          position: content.length,
          isApplied: false
        }
      ];

      setSuggestions(newSuggestions);
      setShowAIAgent(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'AI Agent Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingSuggestions(false);
    }
  };

  // Apply a suggestion to the content
  const applySuggestion = (suggestion: AISuggestion) => {
    let newContent = content;
    
    if (suggestion.type === 'enhance') {
      // Replace last paragraph with enhanced version
      const paragraphs = content.split('\n\n');
      if (paragraphs.length > 0) {
        paragraphs[paragraphs.length - 1] = suggestion.content;
        newContent = paragraphs.join('\n\n');
      }
    } else if (suggestion.type === 'continue' || suggestion.type === 'amplify') {
      // Add at the end
      newContent = content + (content.endsWith(' ') ? '' : ' ') + suggestion.content + ' ';
    }
    
    onApplyChanges(newContent);
    
    // Mark suggestion as applied
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? { ...s, isApplied: true } : s)
    );

    toast({
      title: 'Suggestion Applied',
      description: 'The AI suggestion has been added to your note.',
    });
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'enhance': return <Wand2 className="h-3 w-3" />;
      case 'amplify': return <TrendingUp className="h-3 w-3" />;
      case 'continue': return <ChevronRight className="h-3 w-3" />;
      default: return <Lightbulb className="h-3 w-3" />;
    }
  };

  const handleProcessAI = () => {
    processStreamingAI(selectedAction, content, uploadedImage, customPrompt, targetLanguage);
  };

  const handleApplyChanges = () => {
    if (result && ["improve", "translate", "summarize"].includes(selectedAction)) {
      onApplyChanges(result);
      clearResult();
      toast({
        title: "Changes applied",
        description: "The AI-generated content has been applied to your note."
      });
    }
  };

  const handleOCRTextExtracted = (text: string) => {
    onApplyChanges(content + (content.endsWith('\n') || content === '' ? '' : '\n') + text);
    toast({
      title: "OCR text inserted",
      description: "Extracted text has been added to your note."
    });
  };

  const displayText = streamingResult || result;

  return (
    <div className="w-full md:w-80 lg:w-96 glass-panel-dark rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5 h-[calc(100vh-200px)]">
      <div className="p-3 border-b border-white/5 flex items-center justify-between bg-[#03010a]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-noteflow-400" />
          <h3 className="text-white font-medium">Gemini 2.5 Flash AI</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10" 
            onClick={() => setIsDisclaimerOpen(true)} 
            title="AI Usage & Privacy Information"
          >
            <InfoIcon className="h-3.5 w-3.5 text-slate-300" />
          </Button>
          <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">Free</Badge>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto bg-[#03010a]">
        {/* Usage info with privacy badge */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-300">Privacy Protected</span>
            </div>
            <span className="text-xs text-slate-400">{usageStats.used} requests today</span>
          </div>
          
          {/* Queue status */}
          {(isLoading || queueSize > 0) && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-amber-400" />
              <span className="text-xs text-amber-300/80">
                {isLoading && queueSize === 0 ? 'Processing...' : `${queueSize} requests in queue`}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-xs space-x-1.5">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span className="text-xs text-amber-300/80">AI may produce inaccurate content</span>
          </div>
        </div>

        {/* AI Agent Section */}
        <div className="p-3 bg-black/20 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-noteflow-400" />
              <span className="text-sm text-white font-medium">AI Agent</span>
              {showAIAgent && (
                <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
                  Active
                </Badge>
              )}
            </div>
            <Button
              onClick={() => setShowAIAgent(!showAIAgent)}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-slate-400 hover:text-white"
            >
              {showAIAgent ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showAIAgent && (
            <div className="space-y-3">
              <Button
                onClick={generateSuggestions}
                disabled={isProcessingSuggestions}
                size="sm"
                className="bg-noteflow-500 hover:bg-noteflow-600 text-white w-full"
              >
                {isProcessingSuggestions ? (
                  <>
                    <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 mr-1" />
                    Generate Ideas
                  </>
                )}
              </Button>

              {/* Suggestions list */}
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    AI Suggestions
                  </h4>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        suggestion.isApplied 
                          ? "bg-green-500/10 border-green-500/20 opacity-50" 
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          {getSuggestionIcon(suggestion.type)}
                          <span className="text-xs font-medium text-white capitalize">
                            {suggestion.type}
                          </span>
                        </div>
                        {!suggestion.isApplied && (
                          <Button
                            onClick={() => applySuggestion(suggestion)}
                            size="sm"
                            variant="ghost"
                            className="h-5 px-1.5 text-xs bg-noteflow-500/20 hover:bg-noteflow-500/30 text-noteflow-300"
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {suggestion.content}
                      </p>
                      {suggestion.isApplied && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-300">Applied</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {suggestions.length === 0 && !isProcessingSuggestions && (
                <div className="text-center py-4">
                  <MessageSquare className="h-6 w-6 text-slate-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-400">
                    Click "Generate Ideas" to get AI suggestions
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* OCR Access */}
        <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/10">
          <div className="flex items-center gap-2">
            <FileImage className="h-4 w-4 text-noteflow-400" />
            <span className="text-sm text-white">Extract Text from Image</span>
          </div>
          <OCRButton onClick={() => setIsOCROpen(true)} variant="outline" className="border-noteflow-500/30 bg-noteflow-500/10 text-noteflow-300 hover:bg-noteflow-500/20" />
        </div>

        <AIActionSelector 
          selectedAction={selectedAction} 
          onActionChange={setSelectedAction} 
          targetLanguage={targetLanguage} 
          onLanguageChange={setTargetLanguage} 
        />

        {/* Image upload for image analysis */}
        {selectedAction === "image_analyze" && (
          <ImageUploadArea 
            uploadedImage={uploadedImage} 
            onImageUpload={handleImageUpload} 
            onRemoveImage={removeUploadedImage} 
            fileInputRef={fileInputRef} 
          />
        )}

        {/* Custom prompt */}
        <div>
          <label className="text-xs text-slate-300 block mb-1">Custom Prompt (Optional):</label>
          <Textarea 
            placeholder="Enter a custom prompt to guide the AI..." 
            value={customPrompt} 
            onChange={e => setCustomPrompt(e.target.value)} 
            className="h-16 text-xs resize-none bg-black/30 border-white/10 text-white" 
          />
        </div>

        {/* Process/Stop buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleProcessAI} 
            disabled={isLoading} 
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {queueSize > 0 ? `Queued (${queueSize})` : 'Processing...'}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Process with AI
              </>
            )}
          </Button>

          {isStreaming && (
            <Button 
              onClick={stopStreaming} 
              variant="outline" 
              className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200" 
              title="Stop generation"
            >
              <Square className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/30 text-red-300 rounded-md p-2 text-xs">
            {error}
          </div>
        )}

        {/* Streaming/Final Results */}
        {displayText && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white text-sm">
                {isStreaming ? "Generating..." : "Result:"}
              </h4>
              {result && !isStreaming && (
                <Button 
                  onClick={clearResult} 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-slate-400 hover:text-white h-6 px-2"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <div className="relative">
              <Textarea 
                value={displayText} 
                readOnly={!["improve", "translate", "summarize"].includes(selectedAction) || isStreaming} 
                onChange={e => !isStreaming && setCustomPrompt(e.target.value)} 
                className={`h-48 resize-none bg-black/30 border-white/10 text-white text-sm ${isStreaming ? 'animate-pulse' : ''}`} 
                placeholder={isStreaming ? "AI is typing..." : "Result will appear here..."} 
              />
              
              {isStreaming && (
                <div className="absolute bottom-2 right-2">
                  <div className="flex items-center gap-1 text-xs text-noteflow-400">
                    <div className="w-1 h-1 bg-noteflow-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-noteflow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-noteflow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Apply changes button */}
            {result && !isStreaming && ["improve", "translate", "summarize"].includes(selectedAction) && (
              <Button 
                onClick={handleApplyChanges} 
                className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
              >
                Apply Changes to Note
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* AI Disclaimer Dialog */}
      <AIDisclaimer isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />

      {/* OCR Popup */}
      <OCRPopup isOpen={isOCROpen} onClose={() => setIsOCROpen(false)} onTextExtracted={handleOCRTextExtracted} />
    </div>
  );
};

export default AISidebar;
