import { motion } from 'framer-motion';

interface InstructionsProps {
  hasStarted: boolean;
}

export function Instructions({ hasStarted }: InstructionsProps) {
  if (hasStarted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-xl"
    >
      <div className="bg-[#141B2D]/90 backdrop-blur-lg rounded-2xl p-8 border-2 border-[#C9A227] shadow-[0_0_40px_rgba(201,162,39,0.3)]">
        <h2 
          className="text-4xl font-bold text-[#C9A227] mb-4"
          style={{ 
            fontFamily: 'var(--font-cinzel)', 
            textShadow: '0 0 20px rgba(201,162,39,0.6)' 
          }}
        >
          🪄 Défi Magique
        </h2>
        <p 
          className="text-[#E6D5A7] text-lg mb-6"
          style={{ fontFamily: 'var(--font-merriweather)' }}
        >
          Tracez le cercle avec votre souris pour lancer le sort !
        </p>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#C9A227] font-bold text-xl"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Cliquez pour commencer
        </motion.div>
      </div>
    </motion.div>
  );
}
