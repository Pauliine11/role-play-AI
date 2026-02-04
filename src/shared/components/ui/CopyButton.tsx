'use client';

import { useState } from 'react';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`group relative p-2 rounded-lg transition-all hover:bg-[#141B2D] border border-transparent hover:border-[#3A2F1E] ${className}`}
      title={copied ? 'Copié !' : 'Copier le message'}
    >
      {copied ? (
        <svg
          className="w-4 h-4 text-[#5AA865]"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7"></path>
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-[#8C7A5E] group-hover:text-[#C9A227] transition-colors"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      )}
      
      {copied && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2F6B3A] text-[#E6D5A7] text-xs px-3 py-1 rounded-lg shadow-lg whitespace-nowrap border border-[#4A8F50] font-semibold" style={{ fontFamily: 'var(--font-cinzel)' }}>
          Copié !
        </span>
      )}
    </button>
  );
}
