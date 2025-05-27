import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Image, Download, RefreshCw } from 'lucide-react';

interface ImageGenerationPanelProps {
  textPrompt: string;
  customPrompt: string;
  onGenerateImage: (prompt: string, style?: string) => Promise<void>;
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
    <div className="flex flex-col h-full">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-white mb-1">AI Image Generation</h3>
        <p className="text-xs text-slate-400">
          Create AI-generated images based on your description
        </p>
      </div>
      
      {/* Prompt input */}
      <div className="mb-3">
        <Textarea
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="bg-white/5 border-white/10 text-white resize-none h-24"
        />
        <p className="text-xs text-slate-500 mt-1">
          {prompt ? prompt.length : 0}/1000 characters
          {!prompt && (textPrompt || customPrompt) && (
            <span className="ml-2 text-blue-400">
              Using text from editor/custom instructions
            </span>
          )}
        </p>
      </div>
      
      {/* Style selection */}
      <div className="mb-4">
        <label className="text-xs font-medium text-white mb-2 block">Select Style</label>
        <div className="grid grid-cols-3 gap-2">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`
                rounded-md p-2 text-xs text-white transition-all
                ${selectedStyle === style.id 
                  ? `bg-gradient-to-r ${style.color} ring-2 ring-white/30` 
                  : 'bg-white/5 hover:bg-white/10'}
              `}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Image preview area */}
      <div className="flex-1 overflow-hidden bg-black/20 rounded-lg mb-3 flex items-center justify-center relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
            <span className="text-slate-300 text-sm">Generating image...</span>
          </div>
        ) : generatedImageUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={generatedImageUrl} 
              alt="AI Generated" 
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="bg-black/60 hover:bg-black/80 border-white/10"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-black/60 hover:bg-black/80 border-white/10"
                onClick={handleGenerateImage}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm p-4">{error}</div>
        ) : (
          <div className="text-slate-500 text-sm italic flex flex-col items-center">
            <Image className="h-12 w-12 text-slate-700 mb-2" />
            <span>AI-generated image will appear here</span>
          </div>
        )}
      </div>
      
      {/* Generate button */}
      <Button 
        onClick={handleGenerateImage} 
        disabled={loading || (!prompt && !customPrompt && !textPrompt)} 
        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image className="mr-2 h-4 w-4" />}
        Generate Image
      </Button>
      
      <div className="mt-2 text-xs text-slate-500">
        Powered by Gemini 2.5 Flash image generation capabilities
      </div>
    </div>
  );
};

export default ImageGenerationPanel;
