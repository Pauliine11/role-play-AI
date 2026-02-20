'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AnimationSettings } from '@/shared/components/ui/AnimationSettings';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsMenu({ isOpen, onClose }: SettingsMenuProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-[#141B2D] border-4 border-[#C9A227] rounded-xl shadow-[0_16px_64px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#C9A227]" style={{ fontFamily: 'var(--font-cinzel)' }}>
                    Paramètres
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center text-[#B8A77E] hover:text-[#E6D5A7] hover:bg-[#6B4F2F] rounded-full transition-all"
                  >
                    ✕
                  </button>
                </div>

                <AnimationSettings />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
