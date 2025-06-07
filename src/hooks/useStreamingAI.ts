
import { useState, useRef, useCallback } from 'react';
import { StreamingTextRenderer } from '@/utils/streamingUtils';
import { useToast } from '@/hooks/use-toast';

type AIAction = "analyze" | "ideas" | "improve" | "translate" | "summarize" | "image_analyze";

interface UploadedImage {
  url: string;
  preview: string;
  name: string;
}

export const useStreamingAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [streamingResult, setStreamingResult] = useState("");
  const streamingRenderer = useRef<StreamingTextRenderer | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const stopStreaming = useCallback(() => {
    if (streamingRenderer.current) {
      streamingRenderer.current.stop();
      streamingRenderer.current = null;
    }
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
  }, []);

  const processStreamingAI = async (
    selectedAction: AIAction,
    content: string,
    uploadedImage: UploadedImage | null,
    customPrompt: string,
    targetLanguage: string = "French"
  ) => {
    // Validation
    if (selectedAction !== "image_analyze" && !content.trim() && customPrompt.trim() === "") {
      setError("Your note is empty. Please add some content first.");
      return;
    } else if (selectedAction === "image_analyze" && !uploadedImage) {
      setError("Please upload an image to analyze.");
      return;
    }

    setIsLoading(true);
    setIsStreaming(true);
    setError(null);
    setResult("");
    setStreamingResult("");

    // Create new abort controller
    abortController.current = new AbortController();

    try {
      const imageUrl = uploadedImage?.url || null;
      const processContent = selectedAction !== "image_analyze" ? content : "";
      const promptText = customPrompt.trim() ? customPrompt : undefined;
      
      let prompt = "";
      switch (selectedAction) {
        case "analyze":
          prompt = `Analyze this content in detail: ${processContent}`;
          break;
        case "ideas":
          prompt = `Generate creative ideas based on: ${processContent}`;
          break;
        case "improve":
          prompt = `Improve and enhance this writing: ${processContent}`;
          break;
        case "translate":
          prompt = `Translate this to ${targetLanguage}: ${processContent}`;
          break;
        case "summarize":
          prompt = `Summarize this content: ${processContent}`;
          break;
        case "image_analyze":
          prompt = "Analyze this image in detail and describe what you see.";
          break;
      }

      if (promptText) {
        prompt = `${promptText}\n\nContent: ${processContent}`;
      }

      // Simulate streaming response (replace with actual API call)
      const mockResponse = await simulateStreamingResponse(prompt, abortController.current.signal);
      
      if (!abortController.current?.signal.aborted) {
        // Start streaming animation
        streamingRenderer.current = new StreamingTextRenderer(
          mockResponse,
          (text) => setStreamingResult(text),
          () => {
            setResult(mockResponse);
            setIsStreaming(false);
            setIsLoading(false);
            toast({
              title: "AI processing complete",
              description: "Your note has been successfully processed.",
            });
          },
          20 // typing speed
        );
        
        streamingRenderer.current.start();
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        toast({
          title: "Generation stopped",
          description: "AI processing was stopped by user.",
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your request.";
        setError(errorMessage);
        toast({
          title: "AI processing failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult("");
    setStreamingResult("");
    setError(null);
    stopStreaming();
  };

  return {
    isLoading,
    isStreaming,
    error,
    result,
    streamingResult,
    processStreamingAI,
    stopStreaming,
    clearResult
  };
};

// Mock function to simulate streaming response
const simulateStreamingResponse = async (prompt: string, signal: AbortSignal): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const responses = {
        "analyze": "This content demonstrates a clear understanding of the subject matter. The structure is well-organized with logical flow between ideas. The writing style is engaging and maintains reader interest throughout. Key strengths include comprehensive coverage of topics and effective use of examples to illustrate points.",
        "ideas": "Here are some creative ideas to expand on your content:\n\n• Interactive multimedia elements to engage readers\n• Case studies from real-world applications\n• Step-by-step tutorials with visual guides\n• Community discussion forums for knowledge sharing\n• Gamification elements to make learning more engaging\n• Mobile-first design considerations\n• Integration with popular productivity tools",
        "improve": "Your content has been enhanced with improved clarity, better structure, and more engaging language. The revised version flows more naturally while maintaining the original meaning and intent. Key improvements include stronger opening statements, clearer transitions between ideas, and more compelling conclusions.",
        "translate": "Voici la traduction de votre contenu en français. Le texte a été adapté pour maintenir le sens original tout en respectant les nuances linguistiques et culturelles de la langue française.",
        "summarize": "Key Points Summary:\n\n• Main concept clearly defined\n• Supporting arguments well-structured\n• Practical applications identified\n• Clear action items outlined\n• Comprehensive coverage of essential topics\n\nThis content provides valuable insights and actionable information for readers."
      };
      
      const defaultResponse = responses.analyze;
      const responseText = Object.entries(responses).find(([key]) => prompt.toLowerCase().includes(key))?.[1] || defaultResponse;
      
      resolve(responseText);
    }, 1000);

    signal.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new Error('AbortError'));
    });
  });
};
