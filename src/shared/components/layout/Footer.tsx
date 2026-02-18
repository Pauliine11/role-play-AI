'use client';

import { useSidebar } from '@/shared/hooks/useSidebar';

interface FooterProps {
  variant?: 'default' | 'immersive';
}

export function Footer({ variant = 'default' }: FooterProps) {
  const { isOpen, isMobile } = useSidebar();
  const _isRPG = variant === 'immersive';
  const currentYear = new Date().getFullYear();

  /**
   * Thème médiéval : pierre sombre, parchemin, or
   */
  const theme = {
    footer: 'bg-[#0E1320]/95 border-[#3A2F1E] shadow-[0_-4px_16px_rgba(0,0,0,0.4)]',
    text: 'text-[#8C7A5E]',
    highlight: 'text-[#B8A77E]',
    iconHover: 'hover:text-[#C9A227]',
    badge: 'bg-[#141B2D] border-[#3A2F1E] text-[#C9A227]'
  };

  return (
    <footer className={`fixed bottom-0 right-0 z-40 backdrop-blur-md border-t transition-all duration-300 ease-in-out ${theme.footer} ${
      isMobile ? 'left-0' : (isOpen ? 'left-64' : 'left-16')
    }`}>
      <div className="px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          {/* Copyright */}
          <div className={`flex items-center gap-2 ${theme.text}`} style={{ fontFamily: 'var(--font-merriweather)' }}>
            <span className="text-[#6B4F2F]">©</span>
            <span>{currentYear}</span>
            <span className={`font-semibold ${theme.highlight}`}>
              Nylorion
            </span>
            <span className="hidden md:inline text-[#8C7A5E]">- Tous droits réservés</span>
          </div>

          {/* Separator */}
          <div className="hidden md:block h-4 w-px bg-[#3A2F1E]"></div>

          {/* Tech Stack */}
          <div className="flex items-center gap-4 text-[#8C7A5E] text-xs" style={{ fontFamily: 'var(--font-merriweather)' }}>
            <div className={`flex items-center gap-1.5 transition-all duration-200 group ${theme.iconHover}`}>
              <span className="group-hover:scale-110 transition-transform duration-200">⚡</span>
              <span className="group-hover:font-semibold">Next.js</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-all duration-200 group ${theme.iconHover}`}>
              <span className="group-hover:scale-110 transition-transform duration-200">✨</span>
              <span className="group-hover:font-semibold">Magie IA</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-all duration-200 group ${theme.iconHover}`}>
              <span className="group-hover:scale-110 transition-transform duration-200">🔐</span>
              <span className="group-hover:font-semibold">Clerk</span>
            </div>
          </div>

          {/* Version Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 border rounded-full ${theme.badge} shadow-lg`}>
              <span className="font-bold text-xs tracking-wider" style={{ fontFamily: 'var(--font-cinzel)' }}>v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
