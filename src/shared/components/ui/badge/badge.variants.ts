/**
 * Badge variants configuration
 * Centralized styling variants for the Badge component
 */

export const badgeVariants = {
  completed: "bg-[#C9A227]/60 text-[#0E1320] border-2 border-[#E6C847] shadow-[0_0_16px_rgba(230,200,71,0.5)] font-bold",
  
  locked: "bg-[#1a1410]/60 text-[#8C7A5E] border border-[#3A2F1E]",
  
  available: "bg-[#8C6A3F]/50 text-[#E6D5A7] border border-[#9A7920] shadow-[0_0_8px_rgba(140,106,63,0.3)]",
  
  default: "bg-[#141B2D]/60 text-[#B8A77E] border border-[#3A2F1E]",
} as const;

export const badgeSizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

export type BadgeVariant = keyof typeof badgeVariants;
export type BadgeSize = keyof typeof badgeSizes;
