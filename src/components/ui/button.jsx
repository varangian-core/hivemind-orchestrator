import React from 'react';
import clsx from 'clsx';

const buttonVariants = (variant, size, className) => {
  return clsx(
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    {
      // Variants
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
      'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
      'border border-gray-300 hover:bg-gray-100': variant === 'outline',
      'bg-gray-100 text-gray-800 hover:bg-gray-200': variant === 'secondary',
      'hover:bg-gray-100': variant === 'ghost',
      'underline-offset-4 hover:underline text-blue-600': variant === 'link',
      
      // Sizes
      'h-10 py-2 px-4': size === 'default',
      'h-9 px-3 rounded-md': size === 'sm',
      'h-11 px-8 rounded-md': size === 'lg',
    },
    className
  );
};

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={buttonVariants(variant, size, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
