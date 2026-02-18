'use client';

import { ComponentPropsWithoutRef, useId, forwardRef } from 'react';
import { clsx } from 'clsx';
import { inputVariants, inputSizes, InputVariant, InputSize } from './input.variants';

type InputProps = {
  label?: string;
  error?: string;
  labelClassName?: string;
  variant?: InputVariant;
  size?: InputSize;
} & ComponentPropsWithoutRef<'input'>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, labelClassName, variant, size = 'md', ...props }, ref) => {
    const generatedId = useId();
    const id = props.id || generatedId;
    
    // Auto-détection du variant error si error est fourni
    const effectiveVariant = error ? 'error' : (variant || 'default');
    const effectiveSize = size as keyof typeof inputSizes;

    return (
      <div className="w-full">
        {label && (
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
        )}
        <input
          id={id}
          ref={ref}
          className={clsx(
            "block w-full rounded-lg transition-all",
            inputVariants[effectiveVariant],
            inputSizes[effectiveSize],
            className
          )}
          style={{ fontFamily: 'var(--font-merriweather)' }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#B84040] font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
