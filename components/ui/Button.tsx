import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

// Define the variants and sizes using cva
const buttonVariants = cva(
  // Base classes applied to all buttons
  '',
  {
    variants: {
      // --- Variant Styles ---
      variant: {
        primary:
          'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl shadow-sm hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200',
        secondary:
          'bg-white  border border-[#046307] hover:bg-[#046307] hover:text-white focus:ring-[#046307] disabled:border-blue-300 disabled:text-blue-300',
        danger:
          'bg-orange-600 text-white hover:bg-orange-700 focus:ring-red-500 disabled:bg-red-300',
        ghost:
          'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:text-blue-300',
        ping:
          'px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl shadow-lg hover:bg-emerald-50 transition-transform hover:scale-105 whitespace-nowrap',
        hot:
          'relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-black text-white uppercase tracking-widest bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 bg-[length:200%_auto] rounded-xl shadow-[0_0_20px_rgba(5,150,105,0.6)] ring-2 ring-emerald-400/50 hover:bg-right hover:scale-105 hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] active:scale-95 active:brightness-125 transition-all duration-500 animate-pulse'
      },
      // --- Size Styles ---
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-5 text-lg',
      },
      // --- Boolean Variants ---
      fullWidth: {
        true: 'w-full',
      },
      isLoading: {
        true: 'opacity-70 cursor-not-allowed',
      },
    },
    // Default variants
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

// Define the component's props interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  /**
   * If true, the button will show a loading spinner.
   */
  isLoading?: boolean;
  /**
   * Optional icon to display before the button text.
   */
  iconBefore?: React.ReactNode;
  /**
   * Optional icon to display after the button text.
   */
  iconAfter?: React.ReactNode;
}

/**
 * A reusable button component with variants, sizes, and loading states,
 * styled with Tailwind CSS and cva.
 */
export const Button: React.FC<ButtonProps> = ({
  className,
  variant,
  size,
  fullWidth,
  isLoading,
  iconBefore,
  iconAfter,
  children,
  ...rest
}) => {
  return (
    <button
      // twMerge safely combines default classes, variant classes, and custom classes
      className={twMerge(
        buttonVariants({ variant, size, fullWidth, isLoading, className })
      )}
      // Button is disabled if explicitly set or if loading
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {/* Show spinner if loading, otherwise show 'before' icon */}
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-current border-r-transparent rounded-full"></span>
      ) : (
        iconBefore
      )}

      {/* Hide content visually if loading, but keep for layout */}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>

      {/* Show 'after' icon (only if not loading) */}
      {!isLoading && iconAfter}
    </button>
  );
};

export default Button;