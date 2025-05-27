import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Brain, Image, FileText, Bot, Code, GitBranch } from 'lucide-react';
import { useGemini25 } from '@/hooks/useGemini25';
import ThinkingDisplay from './ThinkingDisplay';
import StructuredDataDisplay from './StructuredDataDisplay';
import ImageGenerationPanel from './ImageGenerationPanel';

interface Gemini25PanelProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
}

const Gemini25Panel: React.FC<Gemini25PanelProps> = ({ content, onApplyChanges }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedTab, setSelectedTab] = useState('smart-analysis');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const {
    loading,
    error,
    response,
    thinking,
    analyzeWithThinking,
    extractStructuredData,
    generateImage,
    analyzeImages,
    processLongDocument,
    reset
  } = useGemini25({
    onSuccess: (result) => {
      console.log('Gemini 2.5 Flash operation completed successfully');
    },
    onError: (err) => {
      console.error('Gemini 2.5 Flash error:', err);
    }
  });

  // Handle AI-generated content application
  const handleApplyChanges = () => {
    if (response?.result) {
      onApplyChanges(response.result);
    }
  };

  // Handle smart analysis with thinking steps
  const handleSmartAnalysis = async () => {
    reset();
    await analyzeWithThinking(content, customPrompt || undefined);
  };

  // Handle structured data extraction
  const handleExtractData = async () => {
    reset();
    const dataFormat = customPrompt || "main topics, key points, action items, and sentiment";
    await extractStructuredData(content, dataFormat);
  };

  // Handle document processing
  const handleProcessDocument = async () => {
    reset();
    const task = customPrompt || "Summarize and extract key insights";
    await processLongDocument(content, task);
  };

  // Handle image analysis
  const handleImageAnalysis = async () => {
    if (uploadedImages.length === 0) {
      return;
    }
    reset();
    await analyzeImages(uploadedImages, customPrompt || undefined);
  };

  return (
    <div className="flex flex-col h-full bg-[#03010a] rounded-xl overflow-hidden border border-white/5 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-900/40 to-purple-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-medium text-white">Gemini 2.5 Flash AI</h2>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
              Active
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Enhanced AI capabilities with thinking, multimodal processing, and more
        </p>
      </div>

      {/* Tabs & Content */}
      <Tabs 
        defaultValue="smart-analysis" 
        className="flex-1 flex flex-col"
        value={selectedTab}
        onValueChange={setSelectedTab}
      >
        <div className="p-2 bg-black/20">
          <TabsList className="w-full grid grid-cols-5 bg-transparent">
            <TabsTrigger value="smart-analysis" className="data-[state=active]:bg-purple-900/30">
              <Brain className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="structured-data" className="data-[state=active]:bg-blue-900/30">
              <Code className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Structure</span>
            </TabsTrigger>
            <TabsTrigger value="image-generation" className="data-[state=active]:bg-indigo-900/30">
              <Image className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Images</span>
            </TabsTrigger>
            <TabsTrigger value="image-analysis" className="data-[state=active]:bg-teal-900/30">
              <GitBranch className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Analyze</span>
            </TabsTrigger>
            <TabsTrigger value="document-processing" className="data-[state=active]:bg-amber-900/30">
              <FileText className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Document</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {/* Custom prompt input (visible for all tabs) */}
          <div className="mb-4">
            <Input
              placeholder="Enter custom instructions (optional)"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          {/* Smart Analysis Tab */}
          <TabsContent value="smart-analysis" className="h-full flex flex-col">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-white mb-1">Smart Analysis with Thinking</h3>
              <p className="text-xs text-slate-400">
                See the AI's step-by-step thinking process as it analyzes your note content
              </p>
            </div>

            <div className="flex-1 overflow-auto bg-black/20 rounded-lg p-3 mb-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <span className="ml-2 text-slate-300">Processing with AI...</span>
                </div>
              ) : thinking ? (
                <ThinkingDisplay thinking={thinking} result={response?.result} />
              ) : response?.result ? (
                <div className="whitespace-pre-wrap text-white">{response.result}</div>
              ) : error ? (
                <div className="text-red-400 text-sm">{error}</div>
              ) : (
                <div className="text-slate-500 text-sm italic h-full flex items-center justify-center">
                  Click "Analyze with Gemini" to start analysis
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleSmartAnalysis} 
                disabled={loading || !content} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                Analyze with Gemini
              </Button>
              
              {response?.result && (
                <Button 
                  onClick={handleApplyChanges} 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                >
                  Apply Changes
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Structured Data Tab */}
          <TabsContent value="structured-data" className="h-full flex flex-col">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-white mb-1">Extract Structured Data</h3>
              <p className="text-xs text-slate-400">
                Extract structured information from your content in JSON format
              </p>
            </div>

            <div className="flex-1 overflow-auto bg-black/20 rounded-lg p-3 mb-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <span className="ml-2 text-slate-300">Processing with AI...</span>
                </div>
              ) : response?.structuredData ? (
                <StructuredDataDisplay data={response.structuredData} />
              ) : error ? (
                <div className="text-red-400 text-sm">{error}</div>
              ) : (
                <div className="text-slate-500 text-sm italic h-full flex items-center justify-center">
                  Click "Extract Data" to organize your content
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleExtractData} 
                disabled={loading || !content} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Code className="mr-2 h-4 w-4" />}
                Extract Data
              </Button>
            </div>
          </TabsContent>

          {/* Image Generation Tab */}
          <TabsContent value="image-generation" className="h-full">
            <ImageGenerationPanel 
              textPrompt={content}
              customPrompt={customPrompt}
              onGenerateImage={generateImage}
              loading={loading}
              generatedImageUrl={response?.result}
              error={error}
            />
          </TabsContent>

          {/* Image Analysis Tab */}
          <TabsContent value="image-analysis" className="h-full flex flex-col">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-white mb-1">Analyze Images</h3>
              <p className="text-xs text-slate-400">
                Upload images for AI analysis and insights
              </p>
            </div>

            {/* Image upload area */}
            <div className="mb-3 p-3 border border-dashed border-white/20 rounded-lg text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
                    setUploadedImages([...uploadedImages, ...newImages]);
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center py-4">
                  <Image className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-300">Click to upload images</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            </div>

            {/* Image previews */}
            {uploadedImages.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden">
                    <img src={url} alt={`Uploaded ${index}`} className="w-full h-20 object-cover" />
                    <button
                      className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                      onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Analysis results */}
            <div className="flex-1 overflow-auto bg-black/20 rounded-lg p-3 mb-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <span className="ml-2 text-slate-300">Analyzing images...</span>
                </div>
              ) : response?.result ? (
                <div className="whitespace-pre-wrap text-white">{response.result}</div>
              ) : error ? (
                <div className="text-red-400 text-sm">{error}</div>
              ) : (
                <div className="text-slate-500 text-sm italic h-full flex items-center justify-center">
                  Upload images and click "Analyze Images"
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleImageAnalysis} 
                disabled={loading || uploadedImages.length === 0} 
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GitBranch className="mr-2 h-4 w-4" />}
                Analyze Images
              </Button>
              
              {response?.result && (
                <Button 
                  onClick={handleApplyChanges} 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                >
                  Apply Analysis
                </Button>
              )}
            </div>
          </TabsContent>

          {/* Document Processing Tab */}
          <TabsContent value="document-processing" className="h-full flex flex-col">
            <div className="mb-3">
              <h3 className="text-sm font-medium text-white mb-1">Long Document Processing</h3>
              <p className="text-xs text-slate-400">
                Process lengthy documents with advanced context understanding
              </p>
            </div>

            <div className="flex-1 overflow-auto bg-black/20 rounded-lg p-3 mb-3">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  <span className="ml-2 text-slate-300">Processing document...</span>
                </div>
              ) : response?.result ? (
                <div className="whitespace-pre-wrap text-white">{response.result}</div>
              ) : error ? (
                <div className="text-red-400 text-sm">{error}</div>
              ) : (
                <div className="text-slate-500 text-sm italic h-full flex items-center justify-center">
                  Click "Process Document" to begin
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleProcessDocument} 
                disabled={loading || !content} 
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                Process Document
              </Button>
              
              {response?.result && (
                <Button 
                  onClick={handleApplyChanges} 
                  variant="outline" 
                  className="border-white/20 hover:bg-white/10"
                >
                  Apply Results
                </Button>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer */}
      <div className="p-2 border-t border-white/10 bg-black/40 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="h-3 w-3 mr-1" />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
        <div>
          <span className="text-xs">Privacy Protected</span>
        </div>
      </div>
    </div>
  );
};

export default Gemini25Panel;
