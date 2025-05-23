
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { analyzeNote, generateIdeas, improveWriting, translateNote, summarizeText, getUsageStats } from "@/utils/aiUtils";
import { 
  Sparkles, 
  Loader2, 
  BrainCircuit, 
  FileText, 
  Languages, 
  ListTree, 
  Image as ImageIcon,
  CornerDownRight,
  Camera,
  X,
  InfoIcon,
  AlertTriangle,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AIDisclaimer from "./AIDisclaimer";

interface AISidebarProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
  editorHeight?: number;
}

type AIAction = "analyze" | "ideas" | "improve" | "translate" | "summarize" | "image_analyze";

interface UploadedImage {
  url: string;
  preview: string;
  name: string;
}

const AISidebar: React.FC<AISidebarProps> = ({ 
  content, 
  onApplyChanges,
  editorHeight 
}) => {
  const [selectedAction, setSelectedAction] = useState<AIAction>("analyze");
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [usageStats, setUsageStats] = useState(() => getUsageStats());
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Define AI action options with icons
  const aiActions = [
    { value: "analyze", label: "Analyze", icon: <BrainCircuit className="h-4 w-4" /> },
    { value: "ideas", label: "Ideas", icon: <ListTree className="h-4 w-4" /> },
    { value: "improve", label: "Improve", icon: <FileText className="h-4 w-4" /> },
    { value: "translate", label: "Translate", icon: <Languages className="h-4 w-4" /> },
    { value: "summarize", label: "Summarize", icon: <FileText className="h-4 w-4" /> },
    { value: "image_analyze", label: "Image AI", icon: <Camera className="h-4 w-4" /> }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 4MB",
        variant: "destructive"
      });
      return;
    }
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    
    // Convert to base64 for storage/transmission
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUploadedImage({
        url: reader.result as string,
        preview: objectUrl,
        name: file.name
      });
    };
  };
  
  const removeUploadedImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.preview);
      setUploadedImage(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const processAIAction = async () => {
    // Validate based on selected action
    if (selectedAction !== "image_analyze" && !content.trim() && customPrompt.trim() === "") {
      setError("Your note is empty. Please add some content first.");
      return;
    } else if (selectedAction === "image_analyze" && !uploadedImage) {
      setError("Please upload an image to analyze.");
      return;
    }
    
    // Dynamic usage limits - much more flexible than fixed limits
    // Instead of strict enforcement, we'll use a progressive approach
    const currentStats = getUsageStats();
    const isHighUsage = currentStats.used > 100; // Only show warnings for very heavy usage
    
    if (isHighUsage) {
      // Just warn about high usage but still allow usage
      toast({
        title: "High usage detected",
        description: "You're using our AI features extensively. Please use responsibly.",
        variant: "default"
      });
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let response = "";
      const imageUrl = uploadedImage?.url || null;
      const processContent = selectedAction !== "image_analyze" ? content : "";
      const promptText = customPrompt.trim() ? customPrompt : undefined;
      
      switch (selectedAction) {
        case "analyze":
          response = await analyzeNote(processContent, imageUrl, promptText);
          break;
        case "ideas":
          response = await generateIdeas(processContent, imageUrl, promptText);
          break;
        case "improve":
          response = await improveWriting(processContent, imageUrl, promptText);
          break;
        case "translate":
          response = await translateNote(processContent, targetLanguage, imageUrl, promptText);
          break;
        case "summarize":
          response = await summarizeText(processContent, imageUrl, promptText);
          break;
        case "image_analyze":
          if (!imageUrl) {
            throw new Error("No image uploaded for analysis");
          }
          response = await analyzeNote("", imageUrl, "Analyze this image in detail and describe what you see.");
          break;
      }
      
      setResult(response);
      toast({
        title: "AI processing complete",
        description: "Your note has been successfully processed.",
      });
      
      // Update usage stats after successful request
      setUsageStats(getUsageStats());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your request.";
      setError(errorMessage);
      
      toast({
        title: "AI processing failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (result && ["improve", "translate", "summarize"].includes(selectedAction)) {
      onApplyChanges(result);
      setResult("");
      toast({
        title: "Changes applied",
        description: "The AI-generated content has been applied to your note.",
      });
    }
  };

  const clearResult = () => {
    setResult("");
    setError(null);
  };

  return (
    <div 
      className="w-full md:w-80 lg:w-96 glass-panel-dark rounded-xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5"
      style={editorHeight ? { height: `${editorHeight}px` } : {}}
    >
      <div className="p-3 border-b border-white/5 flex items-center justify-between">
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

      <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
        {/* Usage info with privacy badge */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-300">Privacy Protected</span>
            </div>
            <span className="text-xs text-slate-400">{usageStats.used} requests today</span>
          </div>
          <div className="flex items-center text-xs space-x-1.5">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            <span className="text-xs text-amber-300/80">AI may produce inaccurate content</span>
          </div>
        </div>

        {/* AI action buttons */}
        <div className="grid grid-cols-3 gap-2">
          {aiActions.map((action) => (
            <Button
              key={action.value}
              variant={selectedAction === action.value ? "secondary" : "outline"}
              size="sm"
              className={`flex items-center gap-1 ${
                selectedAction === action.value 
                  ? "bg-noteflow-500/20 text-white border-noteflow-500/30" 
                  : "bg-black/20 text-slate-300 border-white/10 hover:bg-noteflow-500/10 hover:text-white"
              }`}
              onClick={() => setSelectedAction(action.value as AIAction)}
            >
              {action.icon}
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Action specific options */}
        {selectedAction === "translate" && (
          <div className="flex gap-2 items-center">
            <label className="text-xs text-slate-300 whitespace-nowrap">Language:</label>
            <Select
              value={targetLanguage}
              onValueChange={setTargetLanguage}
            >
              <SelectTrigger className="flex-1 h-8 text-xs bg-black/30 border-white/10 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-lg border-white/10 text-white">
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
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
        )}

        {/* Image upload for image analysis */}
        {selectedAction === "image_analyze" && (
          <div className="flex flex-col gap-2">
            <div className="w-full h-32 bg-black/30 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center relative">
              {uploadedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={uploadedImage.preview} 
                    alt="Uploaded image" 
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={removeUploadedImage}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
                    title="Remove image"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400 text-center">
                    Drop image here or click to upload
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>
        )}

        {/* Custom prompt */}
        <div>
          <label className="text-xs text-slate-300 block mb-1">Custom Prompt (Optional):</label>
          <Textarea 
            placeholder="Enter a custom prompt to guide the AI..." 
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="h-16 text-xs resize-none bg-black/30 border-white/10 text-white"
          />
        </div>

        {/* Process button */}
        <Button 
          onClick={processAIAction}
          disabled={isLoading}
          className="bg-noteflow-500 hover:bg-noteflow-600 text-white"
        >
          {isLoading ? (
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

        {/* Error message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/30 text-red-300 rounded-md p-2 text-xs">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">AI Results</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearResult}
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
                onClick={handleApplyChanges}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CornerDownRight className="h-3 w-3 mr-1" />
                Apply to Note
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* AI Disclaimer Dialog */}
      <AIDisclaimer 
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
};

export default AISidebar;
