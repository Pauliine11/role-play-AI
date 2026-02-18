'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSidebar } from '@/shared/hooks/useSidebar';
import { useLanguage } from '@/shared/providers/LanguageContext';
import { Button } from '@/shared/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  description?: string;
}

interface SidebarProps {
  variant?: 'default' | 'immersive';
}

export function Sidebar({ variant = 'default' }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, toggle, isMobile } = useSidebar();
  const { t } = useLanguage();
  
  const _isRPG = variant === 'immersive';
  
  // Styles conditionnels pour le thème Hogwarts (RPG)
  /**
   * Thème médiéval/grimoire avec transparence pour laisser voir le background
   * Palette : pierre sombre, cuir, or vieilli, parchemin
   */
  const theme = {
    bg: 'bg-[#101827]/80 backdrop-blur-lg',
    border: 'border-[#3A2F1E]',
    text: 'text-[#B8A77E]',
    activeBg: 'bg-[#6B4F2F] text-[#E6D5A7] border border-[#C9A227]',
    hoverBg: 'hover:bg-[#141B2D]/90 hover:text-[#E6D5A7] hover:shadow-[0_0_8px_rgba(201,162,39,0.15)]',
    iconActive: 'text-[#C9A227]',
    badge: 'bg-[#141B2D]/90 text-[#C9A227] border border-[#3A2F1E]',
    footer: 'bg-[#0E1320]/90 border-[#3A2F1E] text-[#B8A77E]',
    toggle: 'bg-[#141B2D]/90 border-[#3A2F1E] text-[#B8A77E] hover:bg-[#6B4F2F] hover:text-[#E6D5A7] hover:border-[#C9A227]'
  };

  const navItems: NavItem[] = [
    { 
      label: t('sidebar.home') || 'Accueil', 
      href: '/', 
      icon: '📜',
      description: t('sidebar.home.desc') || 'Sélection des niveaux'
    },
    { 
      label: t('sidebar.admin') || 'Admin - Créer Niveau', 
      href: '/admin/levels/new', 
      icon: '⚙️',
      description: t('sidebar.admin.desc') || 'Ajouter un nouveau niveau'
    },
  ];

  return (
    <>
      {/* Backdrop pour mobile quand sidebar ouverte */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 animate-fade-in"
          onClick={toggle}
          aria-hidden="true"
        />
      )}

      <aside className={`fixed left-0 top-0 bottom-0 ${theme.bg} border-r-2 ${theme.border} shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out ${
        isMobile 
          ? `z-50 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}` // Mobile: overlay avec slide
          : `z-40 ${isOpen ? 'w-64' : 'w-16'}` // Desktop: comportement normal
      }`}>
      
      {/* Bouton Toggle - Centré verticalement */}
      <Button
        variant="sidebarToggle"
        onClick={toggle}
        className="absolute top-1/2 -translate-y-1/2 -right-3 z-50 group"
        title={isOpen ? 'Réduire la sidebar' : 'Agrandir la sidebar'}
        aria-label={isOpen ? 'Réduire la sidebar' : 'Agrandir la sidebar'}
      >
        <svg
          className={`w-4 h-4 transition-all duration-300 ${isOpen ? '' : 'rotate-180'}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7"></path>
        </svg>
      </Button>
      
      {/* Logo et Titre */}
      <div className={`p-4 border-b ${theme.border}`}>
        <div className="flex justify-center">
          <div className="relative" style={{ width: isOpen ? '100px' : '60px', height: isOpen ? '100px' : '60px' }}>
            <Image
              src="/logoGrimoire.png"
              alt="Logo"
              fill
              className="object-contain transition-all duration-300"
              priority
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {navItems.map((item: NavItem) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className={`
                    group relative flex items-center rounded-lg transition-all duration-200
                    ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'}
                    ${
                      isActive
                        ? `${theme.activeBg} font-medium shadow-sm`
                        : `${theme.text} ${theme.hoverBg}`
                    }
                  `}
                  title={!isOpen ? item.label : undefined}
                >
                  {/* Barre de sélection à gauche - Or */}
                  {isActive && isOpen && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C9A227] rounded-l-lg shadow-[0_0_8px_rgba(201,162,39,0.5)]"></div>
                  )}
                  
                  <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${isActive ? theme.iconActive : ''}`}>
                    {item.icon}
                  </span>
                  
                  {isOpen && (
                    <>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && !isActive && (
                          <div className="text-xs mt-0.5 text-[#8C7A5E] opacity-90">
                            {item.description}
                          </div>
                        )}
                      </div>
                      
                      {item.badge && (
                        <span className={`
                          text-xs px-2 py-0.5 rounded-full font-semibold transition-all border
                          ${
                            isActive
                              ? 'bg-[#C9A227] text-[#0E1320] border-[#9A7920]'
                              : theme.badge
                          }
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  
                  {/* Badge en petit quand sidebar fermée */}
                  {!isOpen && item.badge && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 bg-[#C9A227] rounded-full shadow-[0_0_4px_rgba(201,162,39,0.6)]"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${theme.footer}`}>
        {isOpen ? (
          <div className="text-center">
            <p className="text-xs text-[#8C7A5E] font-merriweather">
              {t('sidebar.footer.powered')}
            </p>
            <p className="text-xs text-[#C9A227] font-semibold mt-1 tracking-wider font-cinzel">
              {t('sidebar.footer.version')}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-xs text-[#C9A227] font-semibold font-cinzel">v2</span>
          </div>
        )}
      </div>
    </aside>
    </>
  );
}
