import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image, Download, RefreshCw } from 'lucide-react';
import { GeminiUsageWrapper } from './GeminiUsageWrapper';

// Define a minimal response type to match what we need from Gemini25Response
interface ImageGenerationResponse {
  result?: string;
  error?: string;
}

interface ImageGenerationPanelProps {
  textPrompt: string;
  customPrompt: string;
  onGenerateImage: (prompt: string, style?: string) => Promise<ImageGenerationResponse | null>;
  loading: boolean;
  generatedImageUrl?: string;
  error?: string;
}

/**
 * Component for generating images using Gemini 2.5 Flash
 * Allows customization of style and downloading of generated images
 */
const ImageGenerationPanel: React.FC<ImageGenerationPanelProps> = ({
  textPrompt,
  customPrompt,
  onGenerateImage,
  loading,
  generatedImageUrl,
  error
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('photorealistic');
  
  // Styles available for image generation
  const styles = [
    { id: 'photorealistic', name: 'Photorealistic', color: 'from-blue-500 to-sky-500' },
    { id: 'cinematic', name: 'Cinematic', color: 'from-purple-500 to-indigo-500' },
    { id: 'digital-art', name: 'Digital Art', color: 'from-pink-500 to-rose-500' },
    { id: 'anime', name: 'Anime', color: 'from-green-500 to-emerald-500' },
    { id: 'illustration', name: 'Illustration', color: 'from-amber-500 to-orange-500' },
    { id: 'fantasy', name: 'Fantasy', color: 'from-violet-500 to-purple-500' }
  ];
  
  // Handle image generation
  const handleGenerateImage = () => {
    // Combine text from editor and custom prompt, or use default text
    const fullPrompt = prompt || customPrompt || textPrompt || '';
    onGenerateImage(fullPrompt, selectedStyle);
  };
  
  // Handle image download
  const handleDownload = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = `gemini-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-white">AI Image Generation</h3>
          <span className="text-xs text-blue-400">
            {!prompt && (textPrompt || customPrompt) && 'Using text from editor'}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
        {/* Left side: controls */}
        <div className="md:col-span-2 flex flex-col space-y-2">
          {/* Prompt input - more compact */}
          <Textarea
            placeholder="Describe the image..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-white/5 border-white/10 text-white resize-none h-16 text-xs"
          />
          
          {/* Style selection - horizontal layout */}
          <div>
            <label className="text-xs font-medium text-white block mb-1">Style:</label>
            <div className="grid grid-cols-3 gap-1">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`
                    rounded-md py-1 px-2 text-xs text-white transition-all
                    ${selectedStyle === style.id 
                      ? `bg-gradient-to-r ${style.color} ring-1 ring-white/30` 
                      : 'bg-white/5 hover:bg-white/10'}
                  `}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Generate button */}
          <GeminiUsageWrapper featureId="ai-image-generation" onUseFeature={handleGenerateImage}>
            <Button 
              disabled={loading || (!prompt && !customPrompt && !textPrompt)}
              size="sm" 
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 mt-1"
            >
              {loading ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Image className="mr-1 h-3 w-3" />}
              Generate Image
            </Button>
          </GeminiUsageWrapper>
        </div>
        
        {/* Right side: image preview */}
        <div className="md:col-span-3 bg-black/20 rounded-lg flex items-center justify-center relative overflow-hidden h-40">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin mb-1" />
              <span className="text-slate-300 text-xs">Generating...</span>
            </div>
          ) : generatedImageUrl ? (
            <div className="relative w-full h-full">
              <img 
                src={generatedImageUrl} 
                alt="AI Generated" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/assets/placeholders/gemini-placeholder.svg';
                  console.warn('Failed to load Gemini-generated image, using placeholder');
                }}
              />
              <div className="absolute bottom-1 right-1 flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-black/60 hover:bg-black/80 border-white/10 text-xs h-6 px-2"
                  onClick={handleDownload}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <GeminiUsageWrapper featureId="ai-image-generation" onUseFeature={handleGenerateImage}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/60 hover:bg-black/80 border-white/10 text-xs h-6 px-2"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                </GeminiUsageWrapper>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-xs p-2">{error}</div>
          ) : (
            <div className="text-slate-500 text-xs italic flex flex-col items-center">
              <div className="h-20 w-20 flex items-center justify-center mb-1">
                <img 
                  src="/assets/placeholders/gemini-placeholder.svg" 
                  alt="Placeholder" 
                  className="max-w-full max-h-full opacity-50"
                />
              </div>
              <span>Image will appear here</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerationPanel;
