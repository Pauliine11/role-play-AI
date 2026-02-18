/**
 * Input variants configuration
 * Centralized styling variants for the Input component
 */

export const inputVariants = {
  default: "bg-[#141B2D] text-[#E6D5A7] border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] shadow-inner",
  
  error: "bg-[#141B2D] text-[#E6D5A7] border-2 border-[#8B2C2C] focus:ring-2 focus:ring-[#8B2C2C]/50 focus:border-[#8B2C2C] placeholder-[#6B5A45] shadow-inner",
  
  chat: "bg-[#141B2D] text-[#E6D5A7] border-2 border-[#3A2F1E] focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] shadow-inner rounded-xl",
} as const;

export const inputSizes = {
  sm: "p-2 text-xs",
  md: "p-3 text-sm",
  lg: "p-4 text-base",
} as const;

export type InputVariant = keyof typeof inputVariants;
export type InputSize = keyof typeof inputSizes;
