
import React from 'react';
import { Languages } from "lucide-react";
import { OCRLanguageSelectorProps, SUPPORTED_LANGS } from '../types/OCRTypes';

const OCRLanguageSelector: React.FC<OCRLanguageSelectorProps> = ({
  selectedLang,
  setSelectedLang,
  isProcessing
}) => {
  return (
    <div className="flex items-center gap-1">
      <Languages className="h-4 w-4 text-slate-300" />
      <select
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value)}
        className="bg-black/50 border border-slate-600 rounded px-2 py-1 text-sm text-white"
        disabled={isProcessing}
      >
        {SUPPORTED_LANGS.map(lang => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>
    </div>
  );
};

export default OCRLanguageSelector;
