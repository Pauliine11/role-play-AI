'use client';

import { useLanguage } from '@/shared/providers/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
      className="px-3 py-2 rounded-lg bg-[#141B2D] hover:bg-[#6B4F2F] border-2 border-[#3A2F1E] hover:border-[#C9A227] text-[#B8A77E] hover:text-[#E6D5A7] transition-all text-sm font-semibold shadow-lg"
      style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.03em' }}
      title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
    >
      {language === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
    </button>
  );
}
