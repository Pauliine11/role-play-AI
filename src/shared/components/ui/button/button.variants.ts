/**
 * Button variants configuration
 * Centralized styling variants for the Button component
 */

export const buttonVariants = {
  primary: "bg-[#8C6A3F] hover:bg-[#C9A227] text-[#E6D5A7] border-2 border-[#9A7920] hover:border-[#C9A227] focus:ring-[#C9A227] shadow-lg hover:shadow-[0_4px_16px_rgba(201,162,39,0.4)]",
  
  secondary: "bg-[#C9A227] hover:bg-[#E6C847] text-[#0E1320] border-2 border-[#E6C847] hover:border-[#F5E68C] focus:ring-[#E6C847] shadow-lg hover:shadow-[0_4px_20px_rgba(230,200,71,0.5)] font-bold",
  
  danger: "bg-gradient-to-r from-[#8B2C2C] to-[#6d2222] hover:from-[#A63838] hover:to-[#8B2C2C] text-[#E6D5A7] border-2 border-[#B84040] focus:ring-[#8B2C2C] shadow-lg shadow-[rgba(139,44,44,0.3)]",
  
  magic: "bg-gradient-to-r from-[#C9A227] to-[#9A7920] hover:from-[#E6C847] hover:to-[#C9A227] text-[#0E1320] border-2 border-[#E6C847] focus:ring-[#C9A227] shadow-lg shadow-[rgba(201,162,39,0.4)] font-bold",
  
  ghost: "bg-[#141B2D]/20 hover:bg-[#141B2D]/40 text-[#B8A77E] hover:text-[#E6D5A7] border-2 border-[#3A2F1E] hover:border-[#C9A227] focus:ring-[#C9A227] backdrop-blur-sm",
  
  // Variantes spécifiques au jeu
  suggestion: "whitespace-nowrap px-4 py-2 bg-[#141B2D] hover:bg-[#6B4F2F] hover:border-[#C9A227] border-2 border-[#3A2F1E] rounded-full text-xs text-[#B8A77E] hover:text-[#E6D5A7] hover:shadow-lg font-medium",
  
  icon: "aspect-square bg-[#6B4F2F] hover:bg-[#8C6A3F] text-[#E6D5A7] rounded-lg flex items-center justify-center border-2 border-[#C9A227] shadow-lg hover:shadow-[0_0_12px_rgba(201,162,39,0.4)]",
  
  close: "text-[#B8A77E] hover:text-[#E6D5A7] bg-[#6B4F2F] hover:bg-[#8C6A3F] rounded-full p-2 border-2 border-[#3A2F1E] hover:border-[#C9A227]",
  
  language: "px-3 py-2 bg-[#141B2D] hover:bg-[#6B4F2F] border-2 border-[#3A2F1E] hover:border-[#C9A227] rounded-lg text-[#B8A77E] hover:text-[#E6D5A7] text-sm font-semibold hover:shadow-lg",
  
  grimoire: "px-4 py-2 bg-[#6B4F2F] hover:bg-[#8C6A3F] border-2 border-[#C9A227] rounded-lg text-[#E6D5A7] text-sm font-semibold shadow-lg hover:shadow-[0_4px_16px_rgba(201,162,39,0.3)]",
  
  // Variantes Layout (Navbar, Sidebar)
  sidebarToggle: "rounded-full p-1.5 hover:scale-105 shadow-sm bg-[#141B2D]/90 border border-[#3A2F1E] text-[#B8A77E] hover:bg-[#6B4F2F] hover:text-[#E6D5A7] hover:border-[#C9A227]",
  
  hamburger: "p-2 rounded-lg active:scale-95 text-[#B8A77E] hover:bg-[#141B2D] hover:text-[#E6D5A7]",
  
  authSignup: "text-[#B8A77E] hover:text-[#E6D5A7] hover:bg-[#6B4F2F]/20 border border-[#3A2F1E] rounded-lg font-semibold",
  
  authSignin: "bg-[#6B4F2F] text-[#E6D5A7] hover:bg-[#8C6A3F] border-2 border-[#C9A227] shadow-lg hover:shadow-[0_4px_12px_rgba(201,162,39,0.3)] rounded-lg font-semibold",
} as const;

export const buttonSizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-8 py-4 text-base",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
