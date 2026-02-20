/**
 * =============================================================================
 * LUMOS / NOX TOGGLE - BOUTON BAGUETTE MAGIQUE
 * =============================================================================
 * 
 * Composant de toggle pour basculer entre mode Lumos (jour) et Nox (nuit)
 * avec une animation de propagation circulaire magique.
 * 
 * FEATURES :
 * - Animation clip-path circle expanding
 * - Icône baguette magique
 * - Tooltip "Lumos !" / "Nox !"
 * - Son optionnel (désactivable)
 * - Position du clic pour l'origine de l'animation
 * 
 * =============================================================================
 */

'use client';

import { useTheme } from '@/shared/providers/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, MouseEvent } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface LumosNoxToggleProps {
  showLabel?: boolean;
  playSound?: boolean;
  className?: string;
}

// ============================================================================
// COMPOSANT
// ============================================================================

export function LumosNoxToggle({ 
  showLabel = false, 
  playSound = false,
  className = '' 
}: LumosNoxToggleProps) {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const [clickPosition, setClickPosition] = useState({ x: 50, y: 50 });
  const [transitioningToTheme, setTransitioningToTheme] = useState<'lumos' | 'nox' | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Calculer la position du clic relative à la fenêtre
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    
    setClickPosition({ x, y });

    // Sauvegarder le thème de destination AVANT le changement
    const nextTheme = theme === 'nox' ? 'lumos' : 'nox';
    setTransitioningToTheme(nextTheme);

    // Son optionnel
    if (playSound) {
      const audio = new Audio(theme === 'nox' ? '/sounds/lumos.wav' : '/sounds/nox.wav');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Silence en cas d'erreur (autoplay bloqué)
      });
    }

    toggleTheme();
  };

  const isLumos = theme === 'lumos';
  const nextSpell = isLumos ? 'Nox' : 'Lumos';
  const icon = isLumos ? '🌙' : '☀️';
  
  // Pour l'animation : utiliser le thème de destination si en transition
  const animationTheme = isTransitioning && transitioningToTheme ? transitioningToTheme : theme;
  const showingLumos = animationTheme === 'lumos';

  return (
    <div className="relative">
      {/* Overlay de transition avec propagation circulaire */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ 
              clipPath: `circle(0% at ${clickPosition.x}% ${clickPosition.y}%)` 
            }}
            animate={{ 
              clipPath: `circle(150% at ${clickPosition.x}% ${clickPosition.y}%)` 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className={`fixed inset-0 z-[9999] pointer-events-none ${
              showingLumos ? 'bg-[#FAF3E0]' : 'bg-[#0E1320]'
            }`}
            style={{
              boxShadow: showingLumos 
                ? '0 0 100px 50px rgba(205, 133, 63, 0.5)' 
                : '0 0 100px 50px rgba(14, 19, 32, 0.8)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Bouton Toggle */}
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isTransitioning}
        className={`
          relative group
          flex items-center gap-2
          px-3 py-2 rounded-lg
          transition-all duration-300
          ${isLumos 
            ? 'bg-[#E8DCC4]/90 hover:bg-[#D4C4A8] border-2 border-[#704214] hover:border-[#CD853F]' 
            : 'bg-[#141B2D]/80 hover:bg-[#6B4F2F] border-2 border-[#3A2F1E] hover:border-[#C9A227]'
          }
          ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isLumos 
            ? 'shadow-lg hover:shadow-[0_4px_16px_rgba(205,133,63,0.3)]' 
            : 'shadow-lg hover:shadow-[0_4px_16px_rgba(201,162,39,0.3)]'
          }
          ${className}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`${nextSpell} !`}
        aria-label={`Lancer le sort ${nextSpell}`}
      >
        {/* Icône baguette magique */}
        <motion.span
          className="text-xl"
          animate={{
            rotate: isTransitioning ? [0, 10, -10, 10, 0] : 0,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          🪄
        </motion.span>

        {/* Label optionnel */}
        {showLabel && (
          <span 
            className={`text-sm font-semibold ${
              isLumos ? 'text-[#704214]' : 'text-[#C9A227]'
            }`}
            style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.05em' }}
          >
            {nextSpell}
          </span>
        )}

        {/* Emoji du thème actuel */}
        <motion.span
          key={theme}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ duration: 0.3 }}
          className="text-lg"
        >
          {icon}
        </motion.span>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            background: isLumos
              ? 'radial-gradient(circle, rgba(205, 133, 63, 0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
          }}
        />
      </motion.button>

      {/* Tooltip sort */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`
              absolute top-full mt-2 left-1/2 -translate-x-1/2
              px-4 py-2 rounded-lg
              whitespace-nowrap
              border-2
              ${showingLumos 
                ? 'bg-[#FAF3E0] border-[#CD853F] text-[#1C0F05]' 
                : 'bg-[#0E1320] border-[#C9A227] text-[#E6D5A7]'
              }
              shadow-[0_4px_16px_rgba(201,162,39,0.4)]
              pointer-events-none z-50
            `}
            style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.05em' }}
          >
            <motion.span
              className="text-sm font-bold"
              animate={{
                textShadow: [
                  '0 0 8px rgba(201, 162, 39, 0.6)',
                  '0 0 16px rgba(201, 162, 39, 0.9)',
                  '0 0 8px rgba(201, 162, 39, 0.6)',
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {showingLumos ? 'Lumos' : 'Nox'} !
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
