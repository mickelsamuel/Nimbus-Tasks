'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  MessageCircle, 
  Bot, 
  Wifi, 
  Settings,
  ExternalLink 
} from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorType: 'render' | 'network' | 'speech' | 'webgl' | 'permission' | 'unknown';
  retryCount: number;
}

class ChatErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorType: 'unknown',
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorType = ChatErrorBoundary.categorizeError(error);
    return {
      hasError: true,
      error,
      errorType
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console for debugging
    console.error('Chat Error Boundary caught an error:', error, errorInfo);
    
    // Report to error tracking service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Report to external monitoring (e.g., Sentry, LogRocket)
    this.reportError(error, errorInfo);
  }

  private static categorizeError(error: Error): State['errorType'] {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';
    
    if (message.includes('webgl') || message.includes('three') || stack.includes('webgl')) {
      return 'webgl';
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'network';
    }
    if (message.includes('speech') || message.includes('microphone') || message.includes('audio')) {
      return 'speech';
    }
    if (message.includes('permission') || message.includes('denied') || message.includes('not allowed')) {
      return 'permission';
    }
    if (message.includes('render') || stack.includes('render')) {
      return 'render';
    }
    
    return 'unknown';
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // In a real app, you'd send this to your error tracking service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorType: this.state.errorType
    };
    
    // Example: Send to monitoring service
    console.log('Error Report:', errorReport);
  }

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      // Max retries reached, suggest page reload
      window.location.reload();
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorType: 'unknown',
      retryCount: 0
    });
  };

  private getErrorMessage() {
    const { errorType } = this.state;
    
    switch (errorType) {
      case 'webgl':
        return {
          title: '3D Graphics Not Available',
          description: 'Your browser or device doesn&apos;t support 3D graphics. You can still use the chat with a simplified interface.',
          icon: <Settings className="h-8 w-8 text-yellow-500" />,
          action: 'Switch to 2D Mode',
          canRetry: false
        };
      
      case 'network':
        return {
          title: 'Connection Issue',
          description: 'Unable to connect to the chat service. Please check your internet connection and try again.',
          icon: <Wifi className="h-8 w-8 text-red-500" />,
          action: 'Retry Connection',
          canRetry: true
        };
      
      case 'speech':
        return {
          title: 'Speech Feature Unavailable',
          description: 'Voice features are not working properly. You can still use text chat normally.',
          icon: <MessageCircle className="h-8 w-8 text-orange-500" />,
          action: 'Continue with Text',
          canRetry: true
        };
      
      case 'permission':
        return {
          title: 'Permission Required',
          description: 'Some features require permissions (microphone, etc.). Please check your browser settings.',
          icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
          action: 'Check Permissions',
          canRetry: true
        };
      
      case 'render':
        return {
          title: 'Display Issue',
          description: 'There was a problem displaying the chat interface. Let&apos;s try refreshing.',
          icon: <RefreshCw className="h-8 w-8 text-blue-500" />,
          action: 'Refresh Interface',
          canRetry: true
        };
      
      default:
        return {
          title: 'Something went wrong',
          description: 'An unexpected error occurred. Our team has been notified and is working on a fix.',
          icon: <AlertTriangle className="h-8 w-8 text-red-500" />,
          action: 'Try Again',
          canRetry: true
        };
    }
  }

  private renderFallback() {
    const { retryCount } = this.state;
    const errorDetails = this.getErrorMessage();
    const isMaxRetries = retryCount >= this.maxRetries;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            {errorDetails.icon}
          </motion.div>
          
          {/* Error Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white mb-4"
          >
            {errorDetails.title}
          </motion.h1>
          
          {/* Error Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 mb-6 leading-relaxed"
          >
            {errorDetails.description}
          </motion.p>
          
          {/* Retry Count Indicator */}
          {retryCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-sm text-gray-400"
            >
              Retry attempt: {retryCount}/{this.maxRetries}
            </motion.div>
          )}
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            {errorDetails.canRetry && !isMaxRetries && (
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                <RefreshCw className="h-4 w-4" />
                {errorDetails.action}
              </button>
            )}
            
            {isMaxRetries && (
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/25"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </button>
            )}
            
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-white/20"
            >
              <Bot className="h-4 w-4" />
              Reset Chat
            </button>
          </motion.div>
          
          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <p className="text-sm text-gray-400 mb-3">Need help?</p>
            <div className="flex justify-center space-x-4 text-sm">
              <a
                href="mailto:support@bnc.ca"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Contact Support
              </a>
              <a
                href="/help"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Help Center
              </a>
            </div>
          </motion.div>
          
          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <motion.details
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-left"
            >
              <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                Debug Information
              </summary>
              <div className="mt-2 p-3 bg-black/20 rounded-lg text-xs text-gray-300 font-mono overflow-auto max-h-32">
                <div className="mb-2">
                  <strong>Error:</strong> {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {this.state.error.stack.slice(0, 500)}...
                    </pre>
                  </div>
                )}
              </div>
            </motion.details>
          )}
        </motion.div>
      </div>
    );
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallbackComponent || this.renderFallback();
    }

    return this.props.children;
  }
}

export default ChatErrorBoundary;