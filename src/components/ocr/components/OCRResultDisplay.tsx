
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  Download, 
  Edit3, 
  FileText, 
  Table, 
  List,
  Clock,
  Award,
  Wand2
} from 'lucide-react';
import { OCRResult } from '@/services/enhancedOCRService';

interface OCRResultDisplayProps {
  result: OCRResult;
  onTextChange: (text: string) => void;
  onCopy: () => void;
  onInsert: () => void;
  onImproveWithAI?: () => void;
  structuredData?: {
    paragraphs: string[];
    tables: string[][];
    lists: string[];
  };
}

const OCRResultDisplay: React.FC<OCRResultDisplayProps> = ({
  result,
  onTextChange,
  onCopy,
  onInsert,
  onImproveWithAI,
  structuredData
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('text');

  const downloadAsText = () => {
    const blob = new Blob([result.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocr-result-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400 border-green-400/30 bg-green-400/10';
    if (confidence >= 70) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    return 'text-red-400 border-red-400/30 bg-red-400/10';
  };

  const getProviderBadge = (provider: string) => {
    return provider === 'google-vision' 
      ? <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Google Vision</Badge>
      : <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Tesseract</Badge>;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with stats */}
      <div className="flex items-center justify-between mb-4 p-3 bg-black/20 rounded-lg border border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-noteflow-400" />
            <Badge className={`text-xs ${getConfidenceColor(result.confidence)}`}>
              {result.confidence}% confidence
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-400">{result.processingTime}ms</span>
          </div>
          
          {getProviderBadge(result.provider)}
        </div>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-slate-300 hover:text-white"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            {isEditing ? 'View' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="bg-black/30 border border-white/10 grid w-full grid-cols-3">
          <TabsTrigger 
            value="text" 
            className="data-[state=active]:bg-noteflow-500/20 data-[state=active]:text-white text-slate-400"
          >
            <FileText className="h-4 w-4 mr-1" />
            Text
          </TabsTrigger>
          
          {structuredData?.tables.length > 0 && (
            <TabsTrigger 
              value="tables" 
              className="data-[state=active]:bg-noteflow-500/20 data-[state=active]:text-white text-slate-400"
            >
              <Table className="h-4 w-4 mr-1" />
              Tables
            </TabsTrigger>
          )}
          
          {structuredData?.lists.length > 0 && (
            <TabsTrigger 
              value="lists" 
              className="data-[state=active]:bg-noteflow-500/20 data-[state=active]:text-white text-slate-400"
            >
              <List className="h-4 w-4 mr-1" />
              Lists
            </TabsTrigger>
          )}
        </TabsList>

        {/* Text content */}
        <TabsContent value="text" className="flex-1 mt-4">
          <Textarea 
            value={result.text} 
            readOnly={!isEditing}
            onChange={(e) => onTextChange(e.target.value)}
            className="h-full resize-none bg-black/30 border-white/10 text-white text-sm"
            placeholder={result.text ? "" : "No text extracted from image"}
          />
        </TabsContent>

        {/* Tables content */}
        {structuredData?.tables.length > 0 && (
          <TabsContent value="tables" className="flex-1 mt-4">
            <div className="space-y-4 max-h-full overflow-y-auto">
              {structuredData.tables.map((table, index) => (
                <div key={index} className="bg-black/30 border border-white/10 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-white mb-2">Table {index + 1}</h4>
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${table.length}, 1fr)` }}>
                    {table.map((cell, cellIndex) => (
                      <div key={cellIndex} className="p-2 bg-black/20 rounded text-xs text-white border border-white/5">
                        {cell}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        )}

        {/* Lists content */}
        {structuredData?.lists.length > 0 && (
          <TabsContent value="lists" className="flex-1 mt-4">
            <div className="space-y-2 max-h-full overflow-y-auto">
              {structuredData.lists.map((item, index) => (
                <div key={index} className="p-2 bg-black/30 border border-white/10 rounded text-sm text-white">
                  {item}
                </div>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
        <Button
          onClick={onCopy}
          variant="outline"
          size="sm"
          className="flex-1 border-white/20 text-white hover:bg-white/10"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </Button>

        <Button
          onClick={downloadAsText}
          variant="outline"
          size="sm"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Download className="h-4 w-4" />
        </Button>

        {onImproveWithAI && (
          <Button
            onClick={onImproveWithAI}
            variant="outline"
            size="sm"
            className="border-noteflow-500/30 bg-noteflow-500/10 text-noteflow-300 hover:bg-noteflow-500/20"
          >
            <Wand2 className="h-4 w-4" />
          </Button>
        )}

        <Button
          onClick={onInsert}
          className="flex-1 bg-noteflow-500 hover:bg-noteflow-600 text-white"
        >
          Insert to Note
        </Button>
      </div>
    </div>
  );
};

export default OCRResultDisplay;
