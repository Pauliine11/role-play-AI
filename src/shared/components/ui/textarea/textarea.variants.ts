/**
 * TextArea variants configuration
 * Centralized styling variants for the TextArea component
 */

export const textareaVariants = {
  default: "bg-[#141B2D] text-[#E6D5A7] border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] shadow-inner",
  
  error: "bg-[#141B2D] text-[#E6D5A7] border-2 border-[#8B2C2C] focus:ring-2 focus:ring-[#8B2C2C]/50 focus:border-[#8B2C2C] placeholder-[#6B5A45] shadow-inner",
} as const;

export type TextAreaVariant = keyof typeof textareaVariants;
