
import { useState } from 'react';
import { analyzeNote, generateIdeas, improveWriting, translateNote, summarizeText, getUsageStats } from "@/utils/aiUtils";
import { useToast } from "@/hooks/use-toast";

type AIAction = "analyze" | "ideas" | "improve" | "translate" | "summarize" | "image_analyze";

interface UploadedImage {
  url: string;
  preview: string;
  name: string;
}

export const useAIProcessor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [usageStats, setUsageStats] = useState(() => getUsageStats());
  const { toast } = useToast();

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

  const clearResult = () => {
    setResult("");
    setError(null);
  };

  return {
    isLoading,
    error,
    result,
    usageStats,
    processAIAction,
    clearResult
  };
};
