
import React from 'react';

/**
 * Validates that a component is properly defined before rendering
 */
export const validateComponent = (component: any, componentName: string): boolean => {
  if (!component) {
    console.error(`Component ${componentName} is undefined or null`);
    return false;
  }
  
  if (typeof component !== 'function' && !React.isValidElement(component)) {
    console.error(`Component ${componentName} is not a valid React component or element`);
    return false;
  }
  
  return true;
};

/**
 * Safe component renderer that validates before rendering
 */
export const SafeComponent: React.FC<{
  component: React.ComponentType<any> | React.ReactElement;
  componentName: string;
  props?: any;
  fallback?: React.ReactNode;
}> = ({ component: Component, componentName, props = {}, fallback = null }) => {
  if (!validateComponent(Component, componentName)) {
    console.warn(`Rendering fallback for invalid component: ${componentName}`);
    return <>{fallback}</>;
  }
  
  if (React.isValidElement(Component)) {
    return Component;
  }
  
  if (typeof Component === 'function') {
    try {
      return <Component {...props} />;
    } catch (error) {
      console.error(`Error rendering component ${componentName}:`, error);
      return <>{fallback}</>;
    }
  }
  
  return <>{fallback}</>;
};

/**
 * Debug helper to log component props and state
 */
export const debugComponent = (componentName: string, props: any, state?: any) => {
  if (import.meta.env.DEV) {
    console.group(`🔍 Debug: ${componentName}`);
    console.log('Props:', props);
    if (state) {
      console.log('State:', state);
    }
    console.groupEnd();
  }
};
