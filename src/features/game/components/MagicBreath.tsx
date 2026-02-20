'use client';

import { motion } from 'framer-motion';

export function MagicBreath() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.3, 0],
          scale: [0.8, 1.2, 1.5],
        }}
        transition={{ 
          duration: 1.5,
          ease: 'easeOut',
        }}
        className="absolute inset-0 bg-gradient-radial from-[#C9A227]/20 via-transparent to-transparent rounded-xl"
      />
      
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            opacity: 0,
            x: '50%',
            y: '50%',
            scale: 0
          }}
          animate={{ 
            opacity: [0, 0.6, 0],
            x: `${50 + Math.cos((i / 8) * Math.PI * 2) * 50}%`,
            y: `${50 + Math.sin((i / 8) * Math.PI * 2) * 50}%`,
            scale: [0, 1, 0.5],
          }}
          transition={{ 
            duration: 1.2,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
          className="absolute w-2 h-2 bg-[#C9A227] rounded-full"
          style={{
            boxShadow: '0 0 12px 4px rgba(201, 162, 39, 0.6)',
          }}
        />
      ))}
    </div>
  );
}
