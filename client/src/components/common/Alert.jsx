import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const variants = {
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    textColor: 'text-green-800',
    icon: <CheckCircle className="h-5 w-5 text-green-400" />,
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-400',
    textColor: 'text-red-800',
    icon: <AlertCircle className="h-5 w-5 text-red-400" />,
  },
  warning: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-800',
    icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-800',
    icon: <Info className="h-5 w-5 text-blue-400" />,
  },
};

const Alert = ({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const { bgColor, borderColor, textColor, icon } = variants[variant];

  return (
    <div
      className={`rounded-md p-4 border-l-4 ${bgColor} ${borderColor} ${className}`}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          {title && <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>}
          {message && <div className={`text-sm ${textColor}`}>{message}</div>}
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;