
import { useState } from "react";

export const useEditorContainerState = () => {
  const [isAIAgentVisible, setIsAIAgentVisible] = useState(false);

  const toggleAIAgent = () => {
    setIsAIAgentVisible(!isAIAgentVisible);
  };

  return {
    isAIAgentVisible,
    setIsAIAgentVisible,
    toggleAIAgent
  };
};
