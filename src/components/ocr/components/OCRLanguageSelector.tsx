
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface OCRLanguageSelectorProps {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  isProcessing: boolean;
}

const OCRLanguageSelector: React.FC<OCRLanguageSelectorProps> = ({
  selectedLang,
  setSelectedLang,
  isProcessing
}) => {
  const languages = [
    { code: 'auto', name: 'Auto-detect', flag: '🌐' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'da', name: 'Danish', flag: '🇩🇰' },
    { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
    { code: 'manual', name: 'Manual Processing', flag: '⚙️' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-noteflow-400" />
      <Select
        value={selectedLang}
        onValueChange={setSelectedLang}
        disabled={isProcessing}
      >
        <SelectTrigger className="w-48 bg-black/30 border-white/10 text-white text-sm">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-black/80 backdrop-blur-lg border-white/10 text-white max-h-60">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code}
              className="hover:bg-white/10 focus:bg-white/10"
            >
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OCRLanguageSelector;
