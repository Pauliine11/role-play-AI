'use client';

import { motion } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { useAnimationPreferences } from '@/shared/providers/AnimationPreferencesContext';

interface Particle {
  id: number;
  size: number;
  x: number;
  duration: number;
  delay: number;
  type: 'spark' | 'glow' | 'star';
  color: string;
}

const PARTICLE_COLORS = [
  { from: '#C9A227', to: '#E6C847', shadow: 'rgba(201, 162, 39, 0.5)' },
  { from: '#E6C847', to: '#F5E68C', shadow: 'rgba(230, 200, 71, 0.4)' },
  { from: '#9A7920', to: '#C9A227', shadow: 'rgba(154, 121, 32, 0.3)' },
];

export function MagicParticles({ count = 15 }: { count?: number }) {
  const { enableParticles } = useAnimationPreferences();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const particles = useMemo<Particle[]>(() => {
    if (!isClient) return [];
    
    /* eslint-disable react-hooks/purity */
    return Array.from({ length: count }, (_, i) => {
      const colorPalette = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      return {
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        duration: Math.random() * 10 + 8,
        delay: Math.random() * 5,
        type: ['spark', 'glow', 'star'][Math.floor(Math.random() * 3)] as 'spark' | 'glow' | 'star',
        color: `linear-gradient(to bottom right, ${colorPalette.from}, ${colorPalette.to})`,
      };
    });
    /* eslint-enable react-hooks/purity */
  }, [count, isClient]);

  if (!enableParticles || !isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((particle) => {
        const wiggleAmount = particle.type === 'star' ? 15 : 5;
        
        return (
          <motion.div
            key={particle.id}
            initial={{ 
              y: '110vh', 
              x: `${particle.x}vw`,
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              y: '-10vh',
              x: [
                `${particle.x}vw`, 
                `${particle.x + wiggleAmount}vw`, 
                `${particle.x - wiggleAmount}vw`, 
                `${particle.x}vw`
              ],
              opacity: [0, 0.9, 0.9, 0],
              scale: particle.type === 'star' ? [0.5, 1.2, 1, 0.3] : [0.5, 1, 1, 0.5],
              rotate: particle.type === 'star' ? [0, 180, 360] : 0,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
              x: {
                duration: particle.duration / 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }
            }}
            className={`absolute ${particle.type === 'star' ? '⭐' : 'rounded-full'}`}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.type !== 'star' ? particle.color : undefined,
              boxShadow: particle.type === 'glow' 
                ? '0 0 16px 6px rgba(201, 162, 39, 0.5)' 
                : '0 0 8px 3px rgba(201, 162, 39, 0.3)',
              filter: particle.type === 'glow' ? 'blur(1px)' : 'blur(0.5px)',
            }}
          >
            {particle.type === 'star' && (
              <span className="text-[#C9A227] drop-shadow-[0_0_8px_rgba(201,162,39,0.8)]">✨</span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
