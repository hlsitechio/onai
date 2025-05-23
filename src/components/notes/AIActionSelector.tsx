
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BrainCircuit, 
  FileText, 
  Languages, 
  ListTree, 
  Camera
} from "lucide-react";

type AIAction = "analyze" | "ideas" | "improve" | "translate" | "summarize" | "image_analyze";

interface AIActionSelectorProps {
  selectedAction: AIAction;
  onActionChange: (action: AIAction) => void;
  targetLanguage: string;
  onLanguageChange: (language: string) => void;
}

const AIActionSelector: React.FC<AIActionSelectorProps> = ({
  selectedAction,
  onActionChange,
  targetLanguage,
  onLanguageChange
}) => {
  const aiActions = [
    { value: "analyze", label: "Analyze", icon: <BrainCircuit className="h-4 w-4" /> },
    { value: "ideas", label: "Ideas", icon: <ListTree className="h-4 w-4" /> },
    { value: "improve", label: "Improve", icon: <FileText className="h-4 w-4" /> },
    { value: "translate", label: "Translate", icon: <Languages className="h-4 w-4" /> },
    { value: "summarize", label: "Summarize", icon: <FileText className="h-4 w-4" /> },
    { value: "image_analyze", label: "Image AI", icon: <Camera className="h-4 w-4" /> }
  ];

  return (
    <>
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
            onClick={() => onActionChange(action.value as AIAction)}
          >
            {action.icon}
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Language selector for translate action */}
      {selectedAction === "translate" && (
        <div className="flex gap-2 items-center">
          <label className="text-xs text-slate-300 whitespace-nowrap">Language:</label>
          <Select
            value={targetLanguage}
            onValueChange={onLanguageChange}
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
    </>
  );
};

export default AIActionSelector;
