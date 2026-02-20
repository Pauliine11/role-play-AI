/**
 * =============================================================================
 * MUSIC PLAYER - CONTRÔLES MUSIQUE DE FOND
 * =============================================================================
 * 
 * Composant de contrôle pour la musique de fond du jeu.
 * Permet au joueur de jouer/pause, ajuster le volume, et muter.
 * 
 * FEATURES :
 * - Bouton play/pause
 * - Slider de volume
 * - Bouton mute
 * - Design médiéval cohérent
 * - Position fixe en bas à gauche
 * 
 * =============================================================================
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface MusicPlayerProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  characterName?: string;
}

// ============================================================================
// COMPOSANT
// ============================================================================

export function MusicPlayer({
  isPlaying,
  volume,
  isMuted,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  characterName = 'Poudlard',
}: MusicPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayVolume = Math.round(volume * 100);
  const actualVolume = isMuted ? 0 : volume;

  return (
    <motion.div
      className="fixed bottom-24 left-4 z-40"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="relative">
        {/* Bouton principal */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            flex items-center gap-2
            px-4 py-3 rounded-lg
            bg-[#141B2D]/95 backdrop-blur-md
            border-2 border-[#3A2F1E]
            hover:border-[#C9A227]
            shadow-[0_4px_16px_rgba(0,0,0,0.6)]
            transition-all duration-300
            hover:shadow-[0_4px_20px_rgba(201,162,39,0.3)]
          "
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Contrôles musique"
        >
          <span className="text-2xl">{isPlaying ? '🎵' : '🎶'}</span>
          
          {/* Indicateur visuel de lecture */}
          {isPlaying && !isMuted && (
            <motion.div
              className="flex gap-1 items-end h-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-[#C9A227] rounded-full"
                  animate={{
                    height: ['4px', '16px', '8px', '16px', '4px'],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </motion.button>

        {/* Panneau de contrôles étendu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="
                absolute bottom-full mb-2 left-0
                w-64 p-4 rounded-lg
                bg-[#141B2D]/98 backdrop-blur-md
                border-2 border-[#3A2F1E]
                shadow-[0_8px_32px_rgba(0,0,0,0.8)]
              "
            >
              {/* Titre */}
              <div className="mb-4 pb-3 border-b border-[#3A2F1E]">
                <p 
                  className="text-sm font-semibold text-[#C9A227] mb-1"
                  style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.05em' }}
                >
                  Ambiance musicale
                </p>
                <p 
                  className="text-xs text-[#B8A77E] italic"
                  style={{ fontFamily: 'var(--font-merriweather)' }}
                >
                  {characterName}
                </p>
              </div>

              {/* Contrôles */}
              <div className="space-y-4">
                {/* Play/Pause */}
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={onTogglePlay}
                    className="
                      flex items-center justify-center
                      w-12 h-12 rounded-full
                      bg-[#6B4F2F] hover:bg-[#8C6A3F]
                      border-2 border-[#C9A227]
                      text-2xl
                      transition-colors duration-200
                      shadow-lg
                    "
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </motion.button>

                  <div className="flex-1">
                    <p 
                      className="text-xs text-[#B8A77E] mb-1"
                      style={{ fontFamily: 'var(--font-merriweather)' }}
                    >
                      {isPlaying ? 'En lecture...' : 'En pause'}
                    </p>
                    <div className="h-1 bg-[#3A2F1E] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#9A7920] to-[#C9A227]"
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: isPlaying ? ['0%', '100%'] : '0%',
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: isPlaying ? Infinity : 0,
                          ease: 'linear',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label 
                      className="text-xs text-[#B8A77E]"
                      style={{ fontFamily: 'var(--font-merriweather)' }}
                    >
                      Volume
                    </label>
                    <span className="text-xs font-semibold text-[#C9A227]">
                      {isMuted ? '🔇' : displayVolume}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Bouton Mute */}
                    <motion.button
                      onClick={onToggleMute}
                      className="
                        flex items-center justify-center
                        w-8 h-8 rounded
                        bg-[#6B4F2F]/50 hover:bg-[#6B4F2F]
                        border border-[#3A2F1E] hover:border-[#C9A227]
                        text-sm
                        transition-colors duration-200
                      "
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={isMuted ? 'Activer le son' : 'Couper le son'}
                    >
                      {isMuted ? '🔇' : actualVolume > 0.5 ? '🔊' : '🔉'}
                    </motion.button>

                    {/* Slider */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={displayVolume}
                      onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
                      disabled={isMuted}
                      className="
                        flex-1 h-2 rounded-full appearance-none cursor-pointer
                        bg-[#3A2F1E]
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-gradient-to-br
                        [&::-webkit-slider-thumb]:from-[#C9A227]
                        [&::-webkit-slider-thumb]:to-[#9A7920]
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-[#E6D5A7]
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-webkit-slider-thumb]:hover:scale-110
                        disabled:opacity-50 disabled:cursor-not-allowed
                      "
                      style={{
                        background: `linear-gradient(to right, 
                          #C9A227 0%, 
                          #C9A227 ${displayVolume}%, 
                          #3A2F1E ${displayVolume}%, 
                          #3A2F1E 100%)`
                      }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="pt-3 border-t border-[#3A2F1E]">
                  <p 
                    className="text-xs text-[#8A7A5E] text-center italic"
                    style={{ fontFamily: 'var(--font-merriweather)' }}
                  >
                    Musique d&apos;ambiance immersive
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
