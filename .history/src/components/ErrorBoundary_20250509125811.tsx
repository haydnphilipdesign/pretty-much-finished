import React from 'react';
import { AlertCircle, RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { Link } from './GlobalLinkProvider';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Enhanced error boundary component that gracefully handles runtime errors
 * and provides helpful error information and recovery options.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capture error details for logging
    this.setState({ error, errorInfo });

    // Log error to monitoring service or console
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // TODO: Add your error logging service here
    // errorLoggingService.captureError(error, errorInfo);
  }

  // Method to reset the error boundary state
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) return fallback;

      // Otherwise use default error UI
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400">
              <AlertCircle size={32} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've encountered an error and we're working to fix it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>

              <Link
                to="/"
                className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>

              <a
                href="mailto:support@parealestatesupport.com?subject=Website Error Report"
                className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Issue
              </a>
            </div>

            {/* Show error details in development environment */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left overflow-auto">
                <details>
                  <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-3">
                    <p className="text-sm font-bold text-red-500 dark:text-red-400 mb-1">
                      {error?.toString()}
                    </p>

                    <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
                      {errorInfo?.componentStack}
                    </p>
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return children;
  }
}

export default ErrorBoundary;

/**
 * Smaller error boundary component for specific sections
 */
export const SectionErrorBoundary: React.FC<{
  children: React.ReactNode;
  fallbackMessage?: string;
}> = ({ children, fallbackMessage = "This section couldn't be loaded" }) => {
  const [hasError, setHasError] = React.useState(false);

  // Reset error state
  const reset = () => setHasError(false);

  // Capture errors in event handlers
  const handleError = (error: Error) => {
    console.error('Error in event handler:', error);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              {fallbackMessage}
            </p>
            <button
              onClick={reset}
              className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Try loading again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Wrap children with error handling context
  return (
    <React.Fragment>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement, {
            onError: handleError
          });
        }
        return child;
      })}
    </React.Fragment>
  );
};

/**
 * Error message component for form fields
 */
export const FieldError: React.FC<{
  message?: string;
  className?: string;
}> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <p className={`mt-1 text-sm text-red-500 dark:text-red-400 ${className}`}>
      {message}
    </p>
  );
};

/**
 * Error alert component for form or page errors
 */
export const ErrorAlert: React.FC<{
  title?: string;
  message: string | string[];
  onDismiss?: () => void;
  className?: string;
}> = ({ title = 'Error', message, onDismiss, className = '' }) => {
  const messages = Array.isArray(message) ? message : [message];

  return (
    <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
            {title}
          </h3>
          {messages.length > 0 && (
            <div className="mt-2 text-sm text-red-700 dark:text-red-200">
              <ul className="list-disc pl-5 space-y-1">
                {messages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className="inline-flex rounded-md p-1.5 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400 focus:ring-offset-2"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Network error handler
 */
export const NetworkErrorMessage: React.FC<{
  message?: string;
  retryAction?: () => void;
}> = ({ message = "We couldn't connect to the server", retryAction }) => {
  return (
    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-orange-500 dark:text-orange-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">
            Connection Error
          </h3>
          <p className="mt-2 text-sm text-orange-700 dark:text-orange-200">
            {message}
          </p>
          {retryAction && (
            <button
              onClick={retryAction}
              className="mt-3 text-sm font-medium text-orange-700 dark:text-orange-200 hover:text-orange-600 dark:hover:text-orange-100 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Error page component for 404, 500, etc.
 */
export const ErrorPage: React.FC<{
  code?: '404' | '500' | string;
  title?: string;
  message?: string;
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
    primary?: boolean;
  }[];
}> = ({
  code = '404',
  title = "Page not found",
  message = "Sorry, we couldn't find the page you're looking for.",
  actions = [
    {
      label: 'Go Home',
      icon: <Home className="w-4 h-4 mr-2" />,
      href: '/',
      primary: true
    }
  ]
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="font-bold text-8xl text-blue-500 dark:text-blue-400 mb-4">
          {code}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          {message}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {actions.map((action, idx) => (
            action.href ? (
              <Link
                key={idx}
                to={action.href}
                className={`flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  action.primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {action.icon}
                {action.label}
              </Link>
            ) : (
              <button
                key={idx}
                onClick={action.onClick}
                className={`flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  action.primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {action.icon}
                {action.label}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};
