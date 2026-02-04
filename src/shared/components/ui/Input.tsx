'use client';

import { ComponentPropsWithoutRef, useId, forwardRef } from 'react';
import { clsx } from 'clsx';

type InputProps = {
  label: string;
  error?: string;
  labelClassName?: string;
} & ComponentPropsWithoutRef<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, labelClassName, ...props }, ref) => {
    const generatedId = useId();
    const id = props.id || generatedId;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className={clsx(
            "block mb-2 text-sm font-semibold text-[#B8A77E]",
            labelClassName
          )}
          style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}
        >
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className={clsx(
            "block p-3 w-full text-sm text-[#E6D5A7] bg-[#141B2D] rounded-lg border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] transition-all placeholder-[#6B5A45] shadow-inner",
            error && "border-[#8B2C2C] focus:border-[#8B2C2C] focus:ring-[#8B2C2C]/50",
            className
          )}
          style={{ fontFamily: 'var(--font-merriweather)' }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#B84040] font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

