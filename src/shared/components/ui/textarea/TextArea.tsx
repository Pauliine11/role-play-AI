'use client';

import { ComponentPropsWithoutRef, useId, forwardRef } from 'react';
import { clsx } from 'clsx';
import { textareaVariants, TextAreaVariant } from './textarea.variants';

type TextAreaProps = {
  label?: string;
  error?: string;
  labelClassName?: string;
  variant?: TextAreaVariant;
} & ComponentPropsWithoutRef<'textarea'>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, labelClassName, variant, ...props }, ref) => {
    const generatedId = useId();
    const id = props.id || generatedId;
    
    // Auto-détection du variant error si error est fourni
    const effectiveVariant = error ? 'error' : (variant || 'default');

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
        <textarea
          id={id}
          ref={ref}
          rows={4}
          className={clsx(
            "block p-3 w-full text-sm rounded-lg transition-all resize-y",
            textareaVariants[effectiveVariant],
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

TextArea.displayName = 'TextArea';
