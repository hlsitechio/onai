
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Wand2 } from "lucide-react";
import { OCRResult } from '@/services/enhancedOCRService';

interface OCRResultDisplayProps {
  result: OCRResult;
  onTextChange: (text: string) => void;
  onCopy: () => void;
  onInsert: () => void;
  onImproveWithAI: () => void;
  structuredData?: any;
}

const OCRResultDisplay: React.FC<OCRResultDisplayProps> = ({
  result,
  onTextChange,
  onCopy,
  onInsert,
  onImproveWithAI,
  structuredData
}) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Extracted Text</h3>
          <Badge variant="outline" className="text-xs">
            {result.confidence}% confidence
          </Badge>
          <Badge variant="outline" className="text-xs">
            {result.provider}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="text-slate-300 hover:text-white"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onImproveWithAI}
            className="text-purple-300 hover:text-purple-200"
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Improve with AI
          </Button>
        </div>
      </div>

      <Textarea
        value={result.text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Extracted text will appear here..."
        className="flex-1 bg-black/30 border-white/20 text-white resize-none"
        spellCheck={false}
      />

      {structuredData && Object.keys(structuredData).length > 0 && (
        <div className="mt-4 p-3 bg-black/20 border border-white/10 rounded-lg">
          <h4 className="text-sm font-medium mb-2 text-white/80">Structured Data Detected:</h4>
          <div className="text-xs text-white/60 space-y-1">
            {structuredData.emails?.length > 0 && (
              <div>Emails: {structuredData.emails.join(', ')}</div>
            )}
            {structuredData.phones?.length > 0 && (
              <div>Phones: {structuredData.phones.join(', ')}</div>
            )}
            {structuredData.urls?.length > 0 && (
              <div>URLs: {structuredData.urls.join(', ')}</div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <Button 
          onClick={onInsert}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Insert to Note
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onCopy}
          className="border-white/20 hover:bg-white/10"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Text
        </Button>
      </div>
    </div>
  );
};

export default OCRResultDisplay;
