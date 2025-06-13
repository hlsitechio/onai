
import { useState } from 'react';
import { analyzeNote, generateIdeas, improveWriting, translateNote, summarizeText, getUsageStats } from "@/utils/aiUtils";
import { useToast } from "@/hooks/use-toast";
import { useAIRequestQueue } from './useAIRequestQueue';

type AIAction = "analyze" | "ideas" | "improve" | "translate" | "summarize" | "image_analyze";

interface UploadedImage {
  url: string;
  preview: string;
  name: string;
}

export const useQueuedAIProcessor = () => {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [usageStats, setUsageStats] = useState(() => getUsageStats());
  const { toast } = useToast();
  const { isProcessing, queueSize, enqueueRequest } = useAIRequestQueue();

  const processAIAction = async (
    selectedAction: AIAction,
    content: string,
    uploadedImage: UploadedImage | null,
    customPrompt: string,
    targetLanguage: string = "French"
  ) => {
    // Validate based on selected action
    if (selectedAction !== "image_analyze" && !content.trim() && customPrompt.trim() === "") {
      setError("Your note is empty. Please add some content first.");
      return;
    } else if (selectedAction === "image_analyze" && !uploadedImage) {
      setError("Please upload an image to analyze.");
      return;
    }
    
    // Dynamic usage limits - much more flexible than fixed limits
    const currentStats = getUsageStats();
    const isHighUsage = currentStats.used > 100;
    
    if (isHighUsage) {
      toast({
        title: "High usage detected",
        description: "You're using our AI features extensively. Please use responsibly.",
        variant: "default"
      });
    }

    setError(null);
    
    try {
      const response = await enqueueRequest(async () => {
        const imageUrl = uploadedImage?.url || null;
        const processContent = selectedAction !== "image_analyze" ? content : "";
        const promptText = customPrompt.trim() ? customPrompt : undefined;
        
        switch (selectedAction) {
          case "analyze":
            return await analyzeNote(processContent, imageUrl, promptText);
          case "ideas":
            return await generateIdeas(processContent, imageUrl, promptText);
          case "improve":
            return await improveWriting(processContent, imageUrl, promptText);
          case "translate":
            return await translateNote(processContent, targetLanguage, imageUrl, promptText);
          case "summarize":
            return await summarizeText(processContent, imageUrl, promptText);
          case "image_analyze":
            if (!imageUrl) {
              throw new Error("No image uploaded for analysis");
            }
            return await analyzeNote("", imageUrl, "Analyze this image in detail and describe what you see.");
          default:
            throw new Error("Invalid action selected");
        }
      });
      
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
    }
  };

  const clearResult = () => {
    setResult("");
    setError(null);
  };

  return {
    isLoading: isProcessing,
    queueSize,
    error,
    result,
    usageStats,
    processAIAction,
    clearResult
  };
};
