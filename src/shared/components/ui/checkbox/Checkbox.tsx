'use client';

import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { clsx } from 'clsx';
import { checkboxVariants, CheckboxVariant } from './checkbox.variants';

type CheckboxProps = {
  label?: string;
  error?: string;
  labelClassName?: string;
  variant?: CheckboxVariant;
} & ComponentPropsWithoutRef<'input'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, labelClassName, variant, id, ...props }, ref) => {
    const effectiveVariant = error ? 'error' : (variant || 'default');
    
    return (
      <div className="flex items-center space-x-3">
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className={clsx(
            checkboxVariants[effectiveVariant],
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className={clsx(
              "text-sm font-medium text-[#B8A77E] cursor-pointer",
              labelClassName
            )}
            style={{ fontFamily: 'var(--font-merriweather)' }}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-sm text-[#B84040] font-medium" style={{ fontFamily: 'var(--font-merriweather)' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
