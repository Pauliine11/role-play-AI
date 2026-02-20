'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import type { ChallengeResult, ChallengeType } from '@/shared/types/challenge';

interface ChallengeSuccessProps {
  result: ChallengeResult;
  challengeType: ChallengeType;
  onContinue: () => void;
}

export function ChallengeSuccess({ result, challengeType, onContinue }: ChallengeSuccessProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onContinue]);

  const getSuccessMessage = () => {
    switch (challengeType) {
      case 'dementor':
        return {
          title: 'Patronus invoqué !',
          message: 'Votre cerf argenté a repoussé le Détraqueur',
          emoji: '🦌',
          color: '#C0D6E4',
        };
      case 'spider':
        return {
          title: 'Araignée repoussée !',
          message: 'L\'Acromentule s\'enfuit terrifiée',
          emoji: '✨',
          color: '#E74C3C',
        };
      case 'fire':
        return {
          title: 'Feu éteint !',
          message: 'Les flammes ont été domptées',
          emoji: '💧',
          color: '#3498DB',
        };
      case 'devil-snare':
        return {
          title: 'Lumière invoquée !',
          message: 'Le Filet du Diable recule dans l\'ombre',
          emoji: '☀️',
          color: '#F39C12',
        };
      case 'serpent':
        return {
          title: 'Serpent dissipé !',
          message: 'Le reptile maléfique s\'évapore',
          emoji: '💨',
          color: '#2ECC71',
        };
      case 'ice-trap':
        return {
          title: 'Glace fondue !',
          message: 'La prison glacée se brise',
          emoji: '🔥',
          color: '#E67E22',
        };
      default:
        return {
          title: 'Victoire !',
          message: 'Vous avez triomphé',
          emoji: '⚡',
          color: '#C9A227',
        };
    }
  };

  const { title, message, emoji, color } = getSuccessMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-none"
    >
      <div className="relative">
        {/* Explosion de particules */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: color,
                left: '50%',
                top: '50%',
                boxShadow: `0 0 20px ${color}`,
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [1, 0],
                x: Math.cos((i / 30) * Math.PI * 2) * 300,
                y: Math.sin((i / 30) * Math.PI * 2) * 300,
                opacity: [1, 0],
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>

        {/* Contenu principal */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="bg-[#141B2D] border-4 border-[#C9A227] rounded-2xl p-12 text-center relative overflow-hidden"
          style={{
            boxShadow: `0 0 60px ${color}, inset 0 0 40px rgba(201,162,39,0.2)`,
          }}
        >
          {/* Lueur d'arrière-plan */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            style={{
              background: `radial-gradient(circle at center, ${color}33 0%, transparent 70%)`,
            }}
          />

          <div className="relative z-10">
            {/* Emoji animé */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-9xl mb-6 filter drop-shadow-2xl"
            >
              {emoji}
            </motion.div>

            {/* Titre */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-[#C9A227] mb-4"
              style={{ 
                fontFamily: 'var(--font-cinzel)', 
                textShadow: `0 0 30px ${color}`,
              }}
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-[#E6D5A7] mb-6"
              style={{ fontFamily: 'var(--font-merriweather)' }}
            >
              {message}
            </motion.p>

            {/* Récompenses */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="space-y-3"
            >
              {/* XP Bonus */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                className="inline-flex items-center gap-3 bg-[#6B4F2F]/50 border-2 border-[#C9A227] rounded-xl px-6 py-3"
              >
                <span className="text-3xl">⭐</span>
                <span className="text-2xl font-bold text-[#C9A227]" style={{ fontFamily: 'var(--font-cinzel)' }}>
                  +{result.xpBonus} XP
                </span>
              </motion.div>

              {/* Indice révélé */}
              {result.hintRevealed && result.hint && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="bg-[#8C6A3F]/30 border-2 border-[#E6D5A7] rounded-xl px-6 py-4 mt-4"
                >
                  <p className="text-lg text-[#E6D5A7] mb-2 flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-cinzel)' }}>
                    <span>💡</span>
                    <span className="font-bold">Indice révélé !</span>
                  </p>
                  <p className="text-base text-[#C9A227] italic" style={{ fontFamily: 'var(--font-merriweather)' }}>
                    {result.hint}
                  </p>
                </motion.div>
              )}

              {/* Temps de complétion */}
              {result.completionTime && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm text-[#B8A77E] mt-4"
                  style={{ fontFamily: 'var(--font-merriweather)' }}
                >
                  Temps : {(result.completionTime / 1000).toFixed(2)}s
                </motion.p>
              )}
            </motion.div>

            {/* Indication de continuation */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
              className="mt-6 text-sm text-[#8C7A5E]"
              style={{ fontFamily: 'var(--font-merriweather)' }}
            >
              Continuation dans quelques instants...
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
