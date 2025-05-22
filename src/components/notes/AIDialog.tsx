
import React, { useState } from "react";
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
import { analyzeNote, generateIdeas, improveWriting, translateNote, summarizeText } from "@/utils/aiUtils";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  onApplyChanges: (newContent: string) => void;
}

type AIAction = "analyze" | "ideas" | "improve" | "translate" | "summarize";

const AIDialog: React.FC<AIDialogProps> = ({ isOpen, onOpenChange, content, onApplyChanges }) => {
  const [selectedAction, setSelectedAction] = useState<AIAction>("analyze");
  const [targetLanguage, setTargetLanguage] = useState("French");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleActionChange = (value: AIAction) => {
    setSelectedAction(value);
    setResult("");
    setError(null);
  };

  const processAIAction = async () => {
    if (!content.trim()) {
      setError("Your note is empty. Please add some content first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      let response = "";
      
      switch (selectedAction) {
        case "analyze":
          response = await analyzeNote(content);
          break;
        case "ideas":
          response = await generateIdeas(content);
          break;
        case "improve":
          response = await improveWriting(content);
          break;
        case "translate":
          response = await translateNote(content, targetLanguage);
          break;
        case "summarize":
          response = await summarizeText(content);
          break;
      }
      
      setResult(response);
      toast({
        title: "AI processing complete",
        description: "Your note has been successfully processed.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while processing your request");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error processing your request",
        variant: "destructive",
      });
    } finally {
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
          <DialogDescription className="text-slate-300">
            Let AI help you with your notes using Gemini 2.5 Flash (powered by Supabase)
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
              </SelectContent>
            </Select>
          </div>

          {selectedAction === "translate" && (
            <div className="flex gap-4 items-center">
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
          )}

          <div className="mt-2">
            <Button 
              variant="default" 
              onClick={processAIAction} 
              disabled={isLoading}
              className="bg-noteflow-500 hover:bg-noteflow-600 text-white"
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
            className="border-white/10 text-white hover:bg-white/10"
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
