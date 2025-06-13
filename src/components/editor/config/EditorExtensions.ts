
import { getV3EnhancedExtensions, validateV3ExtensionConfig } from './V3ExtensionConfigs';

export const createEditorExtensions = () => {
  try {
    const extensions = getV3EnhancedExtensions();
    
    // Validate each extension configuration
    extensions.forEach((extension, index) => {
      const isValid = validateV3ExtensionConfig(extension);
      if (!isValid) {
        console.warn(`Extension at index ${index} failed V3 validation`);
      }
    });
    
    console.log(`✓ Loaded ${extensions.length} V3-enhanced extensions`);
    return extensions;
  } catch (error) {
    console.error('Failed to create V3-enhanced extensions:', error);
    // Fallback to basic configuration if V3 setup fails
    return [];
  }
};
