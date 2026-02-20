'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { ChallengeType } from '@/shared/types/challenge';

interface ChallengeGameOverProps {
  challengeType: ChallengeType;
  onRestart: () => void;
}

export function ChallengeGameOver({ challengeType, onRestart }: ChallengeGameOverProps) {
  const router = useRouter();

  const getMessage = () => {
    switch (challengeType) {
      case 'dementor':
        return {
          title: 'Submergé par les Détraqueurs',
          message: 'Votre Patronus n&apos;était pas assez fort...',
          emoji: '👻',
        };
      case 'spider':
        return {
          title: 'Dévoré par l&apos;Acromentule',
          message: 'L&apos;araignée géante vous a attrapé...',
          emoji: '🕷️',
        };
      case 'fire':
        return {
          title: 'Consumé par les Flammes',
          message: 'Le feu magique vous a submergé...',
          emoji: '🔥',
        };
      case 'devil-snare':
        return {
          title: 'Étouffé par le Filet du Diable',
          message: 'Les lianes maléfiques vous ont emprisonné...',
          emoji: '🌿',
        };
      case 'serpent':
        return {
          title: 'Mordu par le Serpent',
          message: 'Le venin vous a paralysé...',
          emoji: '🐍',
        };
      case 'ice-trap':
        return {
          title: 'Piégé dans la Glace',
          message: 'Le froid éternel vous a saisi...',
          emoji: '🧊',
        };
      default:
        return {
          title: 'Défaite',
          message: 'Vous avez été vaincu...',
          emoji: '💀',
        };
    }
  };

  const { title, message, emoji } = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-lg flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="bg-[#141B2D] border-4 border-red-700 rounded-2xl p-12 max-w-2xl mx-4 text-center relative overflow-hidden"
        style={{
          boxShadow: '0 0 60px rgba(220, 38, 38, 0.5), inset 0 0 40px rgba(220, 38, 38, 0.1)',
        }}
      >
        {/* Effet de brume */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
              }}
            />
          ))}
        </div>

        {/* Contenu */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeInOut' }}
            className="text-9xl mb-6 filter drop-shadow-2xl"
          >
            {emoji}
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-red-500 mb-4"
            style={{ fontFamily: 'var(--font-cinzel)', textShadow: '0 0 30px rgba(239, 68, 68, 0.8)' }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl text-[#E6D5A7] mb-8"
            style={{ fontFamily: 'var(--font-merriweather)' }}
          >
            {message}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="px-8 py-4 bg-[#6B4F2F] hover:bg-[#8C6A3F] text-[#E6D5A7] rounded-xl border-2 border-[#C9A227] font-bold text-lg transition-all shadow-lg hover:shadow-[0_0_20px_rgba(201,162,39,0.5)]"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              🔄 Recommencer le niveau
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-[#141B2D] hover:bg-[#1C2433] text-[#B8A77E] hover:text-[#E6D5A7] rounded-xl border-2 border-[#3A2F1E] hover:border-[#C9A227] font-bold text-lg transition-all"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              🏠 Retour à l&apos;accueil
            </motion.button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-sm text-[#8C7A5E] italic"
            style={{ fontFamily: 'var(--font-merriweather)' }}
          >
            &quot;Le courage ne se mesure pas seulement à la victoire...&quot;
            <br />
            - Albus Dumbledore
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
