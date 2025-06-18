
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedPlaceholderProps {
  isVisible: boolean;
}

const AnimatedPlaceholder: React.FC<AnimatedPlaceholderProps> = ({ isVisible }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const placeholderTexts = [
    'Start writing your thoughts...',
    'AI is here to help you write better...',
    'Select text for AI suggestions...',
    'Press Ctrl+Shift+A for AI agent...',
  ];

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentText('');
      return;
    }

    const targetText = placeholderTexts[currentIndex];
    let timeoutId: NodeJS.Timeout;

    const typeText = (text: string, index: number = 0) => {
      if (index <= text.length) {
        setCurrentText(text.slice(0, index));
        timeoutId = setTimeout(() => typeText(text, index + 1), 50);
      }
    };

    typeText(targetText);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentIndex, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="absolute top-6 left-6 pointer-events-none select-none">
      <div className="text-gray-500 text-base">
        {currentText}
        <span className="animate-pulse">|</span>
      </div>
    </div>
  );
};

export default AnimatedPlaceholder;
