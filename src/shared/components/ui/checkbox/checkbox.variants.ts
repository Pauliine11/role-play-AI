/**
 * Checkbox variants configuration
 */

export const checkboxVariants = {
  default: "w-5 h-5 accent-[#C9A227] bg-[#101827] border-[#3A2F1E] rounded focus:ring-[#C9A227] cursor-pointer",
  
  error: "w-5 h-5 accent-[#B84040] bg-[#101827] border-[#8B2C2C] rounded focus:ring-[#B84040] cursor-pointer",
} as const;

export type CheckboxVariant = keyof typeof checkboxVariants;
