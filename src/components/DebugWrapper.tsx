
import React, { Component, ReactNode } from 'react';
import { logger } from '../utils/consoleControl';

interface Props {
  children: ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

class DebugWrapper extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    logger.error(`DebugWrapper caught error in ${error.stack}:`, error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    logger.error(`DebugWrapper componentDidCatch in ${this.props.componentName}:`, error, errorInfo);
    logger.error('Component stack:', errorInfo.componentStack);
    
    // Log additional debugging information
    logger.debug('Props:', this.props);
    logger.debug('State:', this.state);
  }

  public render() {
    if (this.state.hasError) {
      logger.error(`Rendering error fallback for ${this.props.componentName}`);
      return (
        <div className="p-4 text-center bg-red-50 border border-red-200 rounded">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Error in {this.props.componentName}
          </h2>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              logger.info(`Resetting error state for ${this.props.componentName}`);
              this.setState({ hasError: false, error: undefined });
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    logger.debug(`DebugWrapper rendering ${this.props.componentName} successfully`);
    return this.props.children;
  }
}

export default DebugWrapper;
