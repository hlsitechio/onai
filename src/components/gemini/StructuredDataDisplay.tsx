import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Table, Copy, Check } from 'lucide-react';

// Define a flexible type for structured JSON data
type StructuredDataValue = string | number | boolean | null | StructuredDataObject | StructuredDataArray;
type StructuredDataObject = { [key: string]: StructuredDataValue };
type StructuredDataArray = StructuredDataValue[];

interface StructuredDataDisplayProps {
  data: StructuredDataObject;
}

/**
 * Component to display structured data (JSON) in a readable format
 * Provides both a formatted view and raw JSON view with copy functionality
 */
const StructuredDataDisplay: React.FC<StructuredDataDisplayProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<string>('formatted');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Convert the data to a formatted JSON string
  const jsonString = JSON.stringify(data, null, 2);
  
  // Function to copy JSON to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Render a key-value pair for the formatted view
  const renderKeyValue = (key: string, value: StructuredDataValue, depth = 0) => {
    const paddingLeft = depth * 16;
    
    if (value === null) {
      return (
        <div
          key={key}
          className="flex items-start mb-2"
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          <span className="text-blue-300 font-medium mr-2">{key}:</span>
          <span className="text-slate-400 italic">null</span>
        </div>
      );
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={key}>
          <div
            className="flex items-start mb-2"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <span className="text-blue-300 font-medium">{key}:</span>
          </div>
          {Object.keys(value).map(subKey => renderKeyValue(subKey, value[subKey], depth + 1))}
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div key={key}>
          <div
            className="flex items-start mb-2"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <span className="text-blue-300 font-medium mr-2">{key}:</span>
            <span className="text-slate-400">[</span>
          </div>
          {value.map((item, index) => {
            if (typeof item === 'object' && item !== null) {
              return (
                <div key={index}>
                  {Object.keys(item).map(subKey => renderKeyValue(subKey, item[subKey], depth + 2))}
                  {index < value.length - 1 && (
                    <div
                      className="mb-2"
                      style={{ paddingLeft: `${paddingLeft + 16}px` }}
                    >
                      <span className="text-slate-400">,</span>
                    </div>
                  )}
                </div>
              );
            }
            
            return (
              <div
                key={index}
                className="flex items-start mb-2"
                style={{ paddingLeft: `${paddingLeft + 16}px` }}
              >
                <span className="text-white">{typeof item === 'string' ? `"${item}"` : String(item)}</span>
                {index < value.length - 1 && <span className="text-slate-400">,</span>}
              </div>
            );
          })}
          <div
            className="mb-2"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <span className="text-slate-400">]</span>
          </div>
        </div>
      );
    }
    
    return (
      <div
        key={key}
        className="flex items-start mb-2"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        <span className="text-blue-300 font-medium mr-2">{key}:</span>
        <span className="text-white">
          {typeof value === 'string' ? `"${value}"` : 
           typeof value === 'object' ? JSON.stringify(value) : String(value)}
        </span>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full h-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-2 mb-3 bg-black/30">
          <TabsTrigger value="formatted" className="data-[state=active]:bg-blue-900/30">
            <Table className="h-4 w-4 mr-2" />
            Formatted View
          </TabsTrigger>
          <TabsTrigger value="json" className="data-[state=active]:bg-purple-900/30">
            <Code className="h-4 w-4 mr-2" />
            JSON View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="formatted" className="flex-1 overflow-auto">
          <div className="p-3 bg-black/20 rounded-lg text-sm">
            <div className="text-blue-300 mb-3 pb-2 border-b border-blue-500/20 font-medium flex items-center">
              <Table className="h-4 w-4 mr-2" />
              Structured Data
            </div>
            <div className="mt-2">
              {Object.keys(data).map(key => renderKeyValue(key, data[key]))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="json" className="flex-1 overflow-auto relative">
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={copyToClipboard}
              className="bg-black/40 hover:bg-black/60 p-2 rounded-md text-white transition-colors"
              title="Copy JSON"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          
          <div className="p-3 bg-black/20 rounded-lg text-sm font-mono">
            <div className="text-purple-300 mb-3 pb-2 border-b border-purple-500/20 font-medium flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Raw JSON
            </div>
            <pre className="text-white overflow-auto">{jsonString}</pre>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-2 text-xs text-slate-500">
        Structured data extracted by Gemini 2.5 Flash for programmatic use
      </div>
    </div>
  );
};

export default StructuredDataDisplay;
