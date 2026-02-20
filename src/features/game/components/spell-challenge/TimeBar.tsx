import { motion } from 'framer-motion';

interface TimeBarProps {
  timePercentage: number;
}

export function TimeBar({ timePercentage }: TimeBarProps) {
  return (
    <div className="absolute top-8 left-8 right-8 bg-[#1C2433]/50 rounded-full h-4 border-2 border-[#C9A227]/30 overflow-hidden backdrop-blur-sm">
      <motion.div
        className="h-full bg-gradient-to-r from-[#C9A227] via-[#E6C847] to-[#C9A227]"
        style={{
          width: `${timePercentage}%`,
          boxShadow: timePercentage < 30 
            ? '0 0 20px rgba(201,162,39,0.8), inset 0 0 10px rgba(255,255,255,0.3)' 
            : '0 0 10px rgba(201,162,39,0.5), inset 0 0 10px rgba(255,255,255,0.2)',
        }}
        animate={timePercentage < 30 ? {
          opacity: [1, 0.6, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
