/**
 * Shared UI components and utilities
 */
import React from 'react';

// A simple card component
export const Card = ({ title, children, footer, className = '' }) => {
  return (
    <div className={`border rounded-lg shadow-sm overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 bg-gray-50 border-b">
          <h3 className="font-medium">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-3 bg-gray-50 border-t">{footer}</div>}
    </div>
  );
};

// Form input with label
export const FormInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  className = '',
  error = null,
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Form select with label
export const FormSelect = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  required = false,
  className = '',
  error = null,
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Form textarea with label
export const FormTextarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  rows = 3,
  className = '',
  error = null,
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        className={`w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// Button component with variants
export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = '',
  disabled = false,
  icon = null,
  type = 'button',
  ...props 
}) => {
  // Define variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-100 text-gray-700'
  };
  
  // Define size styles
  const sizeStyles = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };
  
  return (
    <button
      type={type}
      className={`rounded-md ${variantStyles[variant]} ${sizeStyles[size]} flex items-center justify-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// Badge component
export const Badge = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  // Define variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Alert component
export const Alert = ({ 
  children, 
  variant = 'info',
  title = null,
  icon = null,
  className = ''
}) => {
  // Define variant styles
  const variantStyles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };
  
  return (
    <div className={`rounded-md border p-4 ${variantStyles[variant]} ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-2">
          {icon && <span>{icon}</span>}
          {title && <h3 className="font-medium">{title}</h3>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

// Modal component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer = null,
  size = 'md'
}) => {
  if (!isOpen) return null;
  
  // Define size styles
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className={`bg-white rounded-lg shadow-xl ${sizeStyles[size]} w-full mx-4`}>
        {title && (
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t">{footer}</div>}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

// Loading spinner
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  // Define size styles
  const sizeStyles = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4'
  };
  
  return (
    <div className={`rounded-full border-gray-300 border-t-blue-600 animate-spin ${sizeStyles[size]} ${className}`}></div>
  );
};

// Empty state component
export const EmptyState = ({ 
  title, 
  description, 
  action = null, 
  icon = null,
  className = ''
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      {icon && <div className="mx-auto mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

// JSON viewer component
export const JsonViewer = ({ 
  data, 
  expandLevel = 1,
  className = ''
}) => {
  return (
    <pre className={`bg-gray-50 p-4 rounded-md overflow-auto text-sm ${className}`}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

// Form error summary
export const FormErrorSummary = ({ errors = [] }) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
      <h3 className="font-medium mb-2">Please fix the following errors:</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};