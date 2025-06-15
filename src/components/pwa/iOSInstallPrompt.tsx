
import React, { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iOSInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const detectIOS = () => {
      const userAgent = navigator.userAgent;
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const hasBeenDismissed = localStorage.getItem('ios-install-dismissed');
      
      setIsIOS(isIOSDevice);
      
      // Show prompt if iOS, not standalone, and not previously dismissed
      if (isIOSDevice && !isStandalone && !hasBeenDismissed) {
        // Delay showing the prompt for better UX
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    detectIOS();
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('ios-install-dismissed', 'true');
  };

  if (!isIOS || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 shadow-2xl border border-white/20 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm mb-1">
                Install OneAI Notes
              </h3>
              <p className="text-white/80 text-xs leading-relaxed mb-3">
                Add to your home screen for quick access and offline use.
              </p>
              
              <div className="flex items-center gap-2 text-white/90 text-xs">
                <span>Tap</span>
                <Share className="w-3 h-3" />
                <span>then "Add to Home Screen"</span>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white p-1 -mt-1 -mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default iOSInstallPrompt;
