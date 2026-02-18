'use client';

import { ComponentPropsWithoutRef } from 'react';
import { clsx } from 'clsx';
import { badgeVariants, badgeSizes, BadgeVariant, BadgeSize } from './badge.variants';

type BadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
} & ComponentPropsWithoutRef<'div'>;

export const Badge = ({ 
  className, 
  variant = 'default', 
  size = 'md', 
  children, 
  ...props 
}: BadgeProps) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center font-semibold rounded-full backdrop-blur-sm transition-all",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      style={{ fontFamily: 'var(--font-cinzel)' }}
      {...props}
    >
      {children}
    </div>
  );
};
