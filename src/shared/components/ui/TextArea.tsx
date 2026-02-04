'use client';

import { ComponentPropsWithoutRef, useId } from 'react';

type TextAreaProps = {
  label: string;
} & ComponentPropsWithoutRef<'textarea'>;

export const TextArea = ({ label, ...props }: TextAreaProps) => {
  const id = useId();

  return (
    <div className="">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-semibold text-[#B8A77E]"
        style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className="block p-3 w-full text-sm text-[#E6D5A7] bg-[#141B2D] rounded-lg border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] transition-all shadow-inner"
        style={{ fontFamily: 'var(--font-merriweather)' }}
        placeholder="En quoi puis-je vous aider ?"
        {...props}
      ></textarea>
    </div>
  );
};
