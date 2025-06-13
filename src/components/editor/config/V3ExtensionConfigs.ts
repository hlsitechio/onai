
import { getCoreExtensions } from './V3CoreExtensions';
import { getContentExtensions } from './V3ContentExtensions';
import { getTableExtensions } from './V3TableExtensions';
import { getFormattingExtensions } from './V3FormattingExtensions';
import { getUtilityExtensions } from './V3UtilityExtensions';
import { validateV3ExtensionConfig } from './V3BaseConfig';

export { validateV3ExtensionConfig } from './V3BaseConfig';
export type { V3ExtensionConfig } from './V3BaseConfig';

export const getV3EnhancedExtensions = () => {
  try {
    const extensions = [
      ...getCoreExtensions(),
      ...getContentExtensions(),
      ...getTableExtensions(),
      ...getFormattingExtensions(),
      ...getUtilityExtensions()
    ];
    
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
