
export interface SupportedLanguage {
  code: string;
  name: string;
}

export interface OCRPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onTextExtracted: (text: string) => void;
}

export interface OCRImageUploadProps {
  uploadedImage: string | null;
  isProcessing: boolean;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  onImageUpload: (file: File) => void;
  onClearAll: () => void;
  onExtractText: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export interface OCRTextOutputProps {
  extractedText: string;
  setExtractedText: (text: string) => void;
  isProcessing: boolean;
  uploadedImage: string | null;
  onCopyToClipboard: () => void;
  onInsertToNote: () => void;
}

export interface OCRLanguageSelectorProps {
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  isProcessing: boolean;
}

export interface OCRProgressBarProps {
  isProcessing: boolean;
  progress: number;
}

export const SUPPORTED_LANGS: SupportedLanguage[] = [
  { code: 'eng', name: 'English' },
  { code: 'fra', name: 'Français' },
  { code: 'spa', name: 'Español' }
];
