// ONAI Logo Component
import React from 'react';

const ONAILogo = ({ className = '', size = 'medium' }) => {
  // Size presets
  const sizes = {
    small: { height: '24px', maxWidth: '80px' },
    medium: { height: '32px', maxWidth: '120px' },
    large: { height: '48px', maxWidth: '180px' }
  };
  
  const sizeStyle = sizes[size] || sizes.medium;
  
  return (
    <div className={`onai-logo-container ${className}`}>
      <img 
        src="/onai-logo.png" 
        alt="ONAI Logo" 
        className="onai-logo object-contain filter drop-shadow-lg"
        style={{ 
          height: sizeStyle.height, 
          maxWidth: sizeStyle.maxWidth,
          width: 'auto'
        }}
        onError={(e) => {
          console.error('Logo failed to load:', e);
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default ONAILogo;

