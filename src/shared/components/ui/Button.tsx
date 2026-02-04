'use client';

import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger' | 'magic' | 'ghost';
  isLoading?: boolean;
} & ComponentPropsWithoutRef<'button'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-[#8C6A3F] hover:bg-[#C9A227] text-[#E6D5A7] border-2 border-[#9A7920] hover:border-[#C9A227] focus:ring-[#C9A227] shadow-lg hover:shadow-[0_4px_16px_rgba(201,162,39,0.4)]",
      secondary: "bg-[#C9A227] hover:bg-[#E6C847] text-[#0E1320] border-2 border-[#E6C847] hover:border-[#F5E68C] focus:ring-[#E6C847] shadow-lg hover:shadow-[0_4px_20px_rgba(230,200,71,0.5)] font-bold",
      danger: "bg-gradient-to-r from-[#8B2C2C] to-[#6d2222] hover:from-[#A63838] hover:to-[#8B2C2C] text-[#E6D5A7] border-2 border-[#B84040] focus:ring-[#8B2C2C] shadow-lg shadow-[rgba(139,44,44,0.3)]",
      magic: "bg-gradient-to-r from-[#C9A227] to-[#9A7920] hover:from-[#E6C847] hover:to-[#C9A227] text-[#0E1320] border-2 border-[#E6C847] focus:ring-[#C9A227] shadow-lg shadow-[rgba(201,162,39,0.4)] font-bold",
      ghost: "bg-[#141B2D]/20 hover:bg-[#141B2D]/40 text-[#B8A77E] hover:text-[#E6D5A7] border-2 border-[#3A2F1E] hover:border-[#C9A227] focus:ring-[#C9A227] backdrop-blur-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          "inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0E1320] transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          className
        )}
        style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

