
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
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' },
    { code: 'rus', name: 'Russian' },
    { code: 'ara', name: 'Arabic' },
    { code: 'hin', name: 'Hindi' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-white/70" />
      <Select value={selectedLang} onValueChange={setSelectedLang} disabled={isProcessing}>
        <SelectTrigger className="w-[140px] bg-black/30 border-white/20 text-white">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent className="bg-black/95 border-white/20">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code}
              className="text-white hover:bg-white/10"
            >
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OCRLanguageSelector;
