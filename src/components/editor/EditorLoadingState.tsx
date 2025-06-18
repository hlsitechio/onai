
import React from 'react';
import { loadingComponent } from './config/EditorConfig';

const EditorLoadingState: React.FC = () => {
  return (
    <div className={loadingComponent.containerClass}>
      <div className={loadingComponent.spinnerClass}></div>
      <p className="text-sm">{loadingComponent.text}</p>
    </div>
  );
};

export default EditorLoadingState;
