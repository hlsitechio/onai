
import React, { useState } from "react";
import { Search, Replace, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FindReplaceDialogProps {
  onFind: (text: string, options: { caseSensitive: boolean; wholeWord: boolean }) => void;
  onReplace: (findText: string, replaceText: string, replaceAll: boolean) => void;
}

const FindReplaceDialog: React.FC<FindReplaceDialogProps> = ({
  onFind,
  onReplace
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const handleFind = () => {
    if (findText.trim()) {
      onFind(findText, { caseSensitive, wholeWord });
    }
  };

  const handleReplace = (replaceAll: boolean = false) => {
    if (findText.trim()) {
      onReplace(findText, replaceText, replaceAll);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
          title="Find & Replace (Ctrl+F)"
        >
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a2e] border border-white/10 text-white max-w-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Find & Replace</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <Input
                placeholder="Find..."
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                className="bg-black/30 border-white/20 text-white"
                onKeyDown={(e) => e.key === 'Enter' && handleFind()}
              />
            </div>
            
            <div>
              <Input
                placeholder="Replace with..."
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
                className="bg-black/30 border-white/20 text-white"
              />
            </div>
            
            <div className="flex gap-2 text-sm">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  className="w-3 h-3"
                />
                Case sensitive
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wholeWord}
                  onChange={(e) => setWholeWord(e.target.checked)}
                  className="w-3 h-3"
                />
                Whole word
              </label>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleFind}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-3 w-3 mr-1" />
                Find
              </Button>
              <Button
                onClick={() => handleReplace(false)}
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Replace className="h-3 w-3 mr-1" />
                Replace
              </Button>
              <Button
                onClick={() => handleReplace(true)}
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Replace All
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FindReplaceDialog;
