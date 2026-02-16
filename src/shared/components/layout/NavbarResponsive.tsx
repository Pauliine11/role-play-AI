'use client';

import { useSidebar } from '@/shared/hooks/useSidebar';
import Image from 'next/image';
import { LanguageToggle } from '@/shared/components/ui/LanguageToggle';
import { useLanguage } from '@/shared/providers/LanguageContext';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

interface NavbarProps {
  variant?: 'default' | 'immersive';
}

export function NavbarResponsive({ variant = 'default' }: NavbarProps) {
  const { isOpen, toggle, isMobile } = useSidebar();
  const { t } = useLanguage();
  const isRPG = variant === 'immersive';

  /**
   * Thème médiéval : pierre sombre, or, parchemin
   */
  const theme = {
    nav: 'bg-[#101827]/95 border-[#3A2F1E] shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
    text: 'text-[#C9A227]',
    icon: 'text-[#B8A77E] hover:bg-[#141B2D] hover:text-[#E6D5A7]',
    button: 'bg-[#6B4F2F] text-[#E6D5A7] hover:bg-[#8C6A3F] border-2 border-[#C9A227] shadow-lg',
    buttonSecondary: 'text-[#B8A77E] hover:text-[#E6D5A7] hover:bg-[#6B4F2F]/20 border border-[#3A2F1E]'
  };

  return (
    <nav className={`fixed top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ease-in-out ${theme.nav} ${
      isMobile ? 'left-0 right-0' : (isOpen ? 'left-64 right-0' : 'left-16 right-0')
    }`}>
      <div className="h-16 flex items-center justify-between px-4 md:px-8">
        {/* Bouton Menu Hamburger (Mobile uniquement) */}
        {isMobile && (
          <button
            onClick={toggle}
            className={`p-2 rounded-lg transition-all active:scale-95 ${theme.icon}`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}

        {/* Titre - responsive */}
        <div className="flex-1 flex justify-center md:justify-start">
          <h1 className={`text-base sm:text-lg md:text-xl font-bold tracking-wide ${theme.text} drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]`} style={{ fontFamily: 'var(--font-cinzel)' }}>
            <span className="hidden md:inline">{t('nav.title')}</span>
            <span className="md:hidden">{t('nav.titleShort')}</span>
          </h1>
        </div>

        {/* Authentification Clerk à droite */}
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageToggle />
          
          <SignedOut>
            <SignUpButton mode="modal">
              <button className={`${theme.buttonSecondary} text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all font-semibold`} style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}>
                <span className="hidden sm:inline">S&apos;inscrire</span>
                <span className="sm:hidden">Inscription</span>
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className={`${theme.button} text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all font-semibold hover:shadow-[0_4px_12px_rgba(201,162,39,0.3)]`} style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}>
                <span className="hidden sm:inline">Se connecter</span>
                <span className="sm:hidden">Connexion</span>
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <div data-testid="navbar-user-menu">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 rounded-full border-2 border-[#C9A227] hover:border-[#E6C847] transition-all duration-200 shadow-[0_0_8px_rgba(201,162,39,0.3)]"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

