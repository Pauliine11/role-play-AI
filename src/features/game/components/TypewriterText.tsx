'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  showParticles?: boolean;
}

export function TypewriterText({ 
  text, 
  speed = 30, 
  onComplete, 
  className = '',
  showParticles = true 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);

        if (showParticles && Math.random() > 0.7) {
          const newParticle = {
            id: Date.now() + Math.random(),
            x: Math.random() * 100,
            y: Math.random() * 100,
          };
          setParticles((prev) => [...prev, newParticle]);

          setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
          }, 1000);
        }
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete && currentIndex === text.length) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, showParticles]);

  return (
    <div className={`relative ${className}`}>
      {showParticles && particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 1, scale: 0, x: `${particle.x}%`, y: `${particle.y}%` }}
          animate={{ 
            opacity: 0, 
            scale: 1.5,
            y: `${particle.y - 30}%`
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute w-1 h-1 bg-[#C9A227] rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 8px 2px rgba(201, 162, 39, 0.6)',
          }}
        />
      ))}
      <span>{displayedText}</span>
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-0.5 h-5 bg-[#C9A227] ml-0.5 align-middle"
        />
      )}
    </div>
  );
}
