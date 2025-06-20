
// Bundle optimization utilities for reducing chunk sizes
export const LARGE_CHUNK_THRESHOLD = 500; // KB

// Lazy load heavy components to reduce initial bundle size
export const lazyComponents = {
  // Editor components (heavy due to TipTap)
  TiptapEditor: () => import('@/components/editor/TiptapEditor'),
  
  // OCR components (Tesseract.js heavy)
  OCRButton: () => import('@/components/ocr/OCRButton'),
  OCRPopup: () => import('@/components/ocr/OCRPopup'),
  
  // AI components (heavy processing)
  AICommandCenter: () => import('@/components/ai-command-center/AICommandCenter'),
  
  // Chart components (Recharts heavy)
  ChartComponents: () => import('recharts'),
  
  // PWA components
  PWADashboard: () => import('@/components/pwa/PWADashboard'),
};

// Identify heavy dependencies for optimization
export const heavyDependencies = [
  '@tiptap/react',
  '@tiptap/starter-kit', 
  'tesseract.js',
  'recharts',
  'framer-motion',
  'marked',
  'lowlight'
];

// Bundle analysis helper
export const analyzeBundleSize = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const transferSize = navigation.transferSize || 0;
    const decodedSize = navigation.decodedBodySize || 0;
    
    console.log('Bundle Analysis:', {
      transferSize: `${(transferSize / 1024).toFixed(2)} KB`,
      decodedSize: `${(decodedSize / 1024).toFixed(2)} KB`,
      compressionRatio: `${((1 - transferSize / decodedSize) * 100).toFixed(1)}%`
    });
    
    return {
      transferSize,
      decodedSize,
      isLargeBundle: transferSize > LARGE_CHUNK_THRESHOLD * 1024
    };
  }
  
  return null;
};
