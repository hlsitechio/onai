
export interface V3ExtensionConfig {
  name: string;
  priority: number;
  performance: {
    lazy: boolean;
    cacheable: boolean;
    memoryOptimized: boolean;
  };
  accessibility: {
    ariaLabels: boolean;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
  };
  security: {
    sanitizeContent: boolean;
    allowedAttributes: string[];
    allowedTags: string[];
  };
}

export const getBaseConfig = (): Partial<V3ExtensionConfig> => ({
  priority: 100,
  performance: {
    lazy: true,
    cacheable: true,
    memoryOptimized: true
  },
  accessibility: {
    ariaLabels: true,
    keyboardNavigation: true,
    screenReaderSupport: true
  },
  security: {
    sanitizeContent: true,
    allowedAttributes: ['class', 'id', 'href', 'src', 'alt', 'title'],
    allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'table', 'tr', 'td', 'th']
  }
});

export const validateV3ExtensionConfig = (config: any): boolean => {
  try {
    return config && typeof config === 'object' && config.name;
  } catch (error) {
    console.warn('V3 Extension validation failed:', error);
    return false;
  }
};
