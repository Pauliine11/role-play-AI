import { motion } from 'framer-motion';
import type { ChallengeType } from '@/shared/types/challenge';

interface EnemyDisplayProps {
  challengeType: ChallengeType;
  hasStarted: boolean;
  enemyProximity: number;
}

export function EnemyDisplay({ challengeType, hasStarted, enemyProximity }: EnemyDisplayProps) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0, scale: 0.5 }}
      animate={{ 
        x: hasStarted ? 300 - (enemyProximity * 2.5) : 300,
        opacity: 1, 
        scale: hasStarted ? 1 + (enemyProximity / 100) * 0.5 : 1
      }}
      transition={{ duration: 0.5, ease: 'linear' }}
      className="absolute right-12 top-1/2 -translate-y-1/2"
      style={{
        filter: `brightness(${1 + enemyProximity / 100})`,
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="text-9xl filter drop-shadow-2xl"
      >
        {challengeType === 'dementor' && '👻'}
        {challengeType === 'spider' && '🕷️'}
        {challengeType === 'fire' && '🔥'}
        {challengeType === 'devil-snare' && '🌿'}
        {challengeType === 'serpent' && '🐍'}
        {challengeType === 'ice-trap' && '🧊'}
      </motion.div>
    </motion.div>
  );
}
