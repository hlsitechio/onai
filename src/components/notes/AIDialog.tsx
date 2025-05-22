
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeNote, generateIdeas, improveWriting, translateNote, summarizeText, getUsageStats } from "@/utils/aiUtils";
import { Sparkles, Loader2, Image as ImageIcon, X, Upload, Camera, CornerDownRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface AIDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  onApplyChanges: (newContent: string) => void;
}

type AIAction = "analyze" | "ideas" | "improve" | "translate" | "summarize" | "image_analyze";

interface UploadedImage {
  url: string;
  preview: string;
  name: string;
}

const AIDialog: React.FC<AIDialogProps> = ({ isOpen, onOpenChange, content, onApplyChanges }) => {
  const [selectedAction, setSelectedAction] = useState<AIAction>("analyze");
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [activeTab, setActiveTab] = useState<string>("text");
  const [customPrompt, setCustomPrompt] = useState("");
  const [usageStats, setUsageStats] = useState(() => getUsageStats());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleActionChange = (value: AIAction) => {
    setSelectedAction(value);
    setResult("");
    setError(null);
    
    // Switch to image tab if image analysis is selected
    if (value === "image_analyze") {
      setActiveTab("image");
    }
  };
  
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

  // Update usage stats when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setUsageStats(getUsageStats());
    }
  }, [isOpen]);

  const processAIAction = async () => {
    // Validate based on active tab
    if (activeTab === "text" && !content.trim() && customPrompt.trim() === "") {
      setError("Your note is empty. Please add some content first.");
      return;
    } else if (activeTab === "image" && !uploadedImage) {
      setError("Please upload an image to analyze.");
      return;
    }
    
    // Check usage limits
    const currentStats = getUsageStats();
    if (currentStats.used >= currentStats.limit) {
      setError(`You've reached your daily limit of ${currentStats.limit} free AI requests. Try again tomorrow.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let response = "";
      const imageUrl = uploadedImage?.url || null;
      const processContent = activeTab === "text" ? content : "";
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
      setIsLoading(false);
      
      // Update usage stats after successful request
      setUsageStats(getUsageStats());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your request.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    if (result && ["improve", "translate", "summarize"].includes(selectedAction)) {
      onApplyChanges(result);
      onOpenChange(false);
      toast({
        title: "Changes applied",
        description: "The AI-generated content has been applied to your note.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black/40 backdrop-blur-lg border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-noteflow-400" />
            Gemini 2.5 Flash AI Assistant
          </DialogTitle>
          <DialogDescription className="text-slate-300 flex flex-col gap-2">
            <div className="flex items-center">
              Let AI help you with your notes using Gemini 2.5 Flash (powered by Supabase)
              <Badge variant="outline" className="ml-2 bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">Free</Badge>
            </div>
            
            <div className="flex items-center text-xs space-x-2">
              <div className="w-full bg-black/30 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${usageStats.percent > 80 ? 'bg-red-500' : 'bg-noteflow-500'}`} 
                  style={{ width: `${usageStats.percent}%` }}
                ></div>
              </div>
              <span className="whitespace-nowrap">{usageStats.used}/{usageStats.limit} requests today</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <label className="text-sm text-slate-300 w-24">Action:</label>
            <Select
              value={selectedAction}
              onValueChange={(value) => handleActionChange(value as AIAction)}
            >
              <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 backdrop-blur-lg border-white/10 text-white">
                <SelectItem value="analyze">Analyze Note</SelectItem>
                <SelectItem value="ideas">Generate Ideas</SelectItem>
                <SelectItem value="improve">Improve Writing</SelectItem>
                <SelectItem value="translate">Translate</SelectItem>
                <SelectItem value="summarize">Summarize Text</SelectItem>
                <SelectItem value="image_analyze">Analyze Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-black/30 border border-white/10 grid w-full grid-cols-2">
              <TabsTrigger 
                value="text" 
                className="data-[state=active]:bg-noteflow-500/20 data-[state=active]:text-white text-slate-400"
                disabled={selectedAction === "image_analyze"}
              >
                Text Input
              </TabsTrigger>
              <TabsTrigger 
                value="image" 
                className="data-[state=active]:bg-noteflow-500/20 data-[state=active]:text-white text-slate-400"
              >
                Image Input
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="border-none p-0 mt-4">

              {selectedAction === "translate" && (
                <div className="flex gap-4 items-center mb-4">
                  <label className="text-sm text-slate-300 w-24">Language:</label>
                  <Select
                    value={targetLanguage}
                    onValueChange={setTargetLanguage}
                  >
                    <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
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
              )
              }
              
              <div className="mb-4">
                <label className="text-sm text-slate-300 block mb-2">Custom Prompt (Optional):</label>
                <Textarea 
                  placeholder="Enter a custom prompt to guide the AI..." 
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="h-20 resize-none bg-black/30 border-white/10 text-white text-sm"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="border-none p-0 mt-4">
              <div className="flex flex-col gap-4">
                <div className="w-full h-48 bg-black/30 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center relative">
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
                      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                        {uploadedImage.name}
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-white/40 mb-2" />
                      <p className="text-sm text-white/60">Drag & drop or click to upload an image</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-4 border-white/20 text-white/80 hover:bg-white/10"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </div>
                
                <p className="text-xs text-white/50">Images are processed securely and never stored permanently</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <Button 
              variant="default" 
              onClick={processAIAction} 
              disabled={isLoading}
              className="bg-noteflow-500 hover:bg-noteflow-600 text-white w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Process with Gemini AI
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-2 p-3 bg-red-900/30 border border-red-500/30 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4">
              <h4 className="font-medium text-white mb-2">Result:</h4>
              <Textarea 
                value={result} 
                readOnly={!["improve", "translate", "summarize"].includes(selectedAction)}
                onChange={(e) => setResult(e.target.value)} 
                className="h-48 resize-none bg-black/30 border-white/10 text-white"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 flex-col sm:flex-row sm:justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="border-noteflow-500/30 bg-noteflow-500/10 text-noteflow-300 hover:bg-noteflow-500/20 hover:text-white transition-colors"
          >
            Cancel
          </Button>
          
          {(["improve", "translate", "summarize"].includes(selectedAction)) && result && (
            <Button 
              onClick={handleApplyChanges}
              className="bg-noteflow-500 hover:bg-noteflow-600 text-white"
            >
              Apply Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIDialog;
