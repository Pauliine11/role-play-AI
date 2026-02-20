'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { generateSceneImageAction } from '@/features/game/actions/scene-actions';
import { useAnimationPreferences } from '@/shared/providers/AnimationPreferencesContext';

interface SceneTransitionProps {
  levelId: string;
  sceneName: string;
  scenePrompt?: string;
  onComplete?: () => void;
  show?: boolean;
}

export function SceneTransition({ 
  levelId, 
  sceneName, 
  scenePrompt,
  onComplete,
  show = true 
}: SceneTransitionProps) {
  const { enableSceneTransitions } = useAnimationPreferences();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!show || !enableSceneTransitions) {
      if (onComplete && !enableSceneTransitions) {
        onComplete();
      }
      return;
    }

    async function loadSceneImage() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await generateSceneImageAction(levelId, sceneName, scenePrompt);
        
        if (result.success && result.imageUrl) {
          setImageUrl(result.imageUrl);
          console.log('✨ Image de scène chargée');
        } else {
          setError(result.error || 'Erreur de génération');
        }
      } catch (err) {
        console.error('Error loading scene:', err);
        setError('Impossible de charger la scène');
      } finally {
        setIsLoading(false);
      }
    }

    loadSceneImage();
  }, [levelId, sceneName, scenePrompt, show, enableSceneTransitions, onComplete]);

  useEffect(() => {
    if (!isLoading && imageUrl && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, imageUrl, onComplete]);

  if (!show || !enableSceneTransitions) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      >
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="text-6xl mb-6"
            >
              ✨
            </motion.div>
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#C9A227] text-xl font-medium"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              Invocation de la scène magique...
            </motion.p>
            <p className="text-[#B8A77E] text-sm mt-2" style={{ fontFamily: 'var(--font-merriweather)' }}>
              {sceneName}
            </p>
          </motion.div>
        )}

        {error && !imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md p-8"
          >
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-[#C9A227] text-lg mb-2" style={{ fontFamily: 'var(--font-cinzel)' }}>
              La magie a échoué
            </p>
            <p className="text-[#B8A77E] text-sm" style={{ fontFamily: 'var(--font-merriweather)' }}>
              {error}
            </p>
          </motion.div>
        )}

        {imageUrl && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={imageUrl}
                alt={sceneName}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative z-10 text-center max-w-2xl px-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                className="mb-4"
              >
                <div className="inline-block px-6 py-3 bg-[#6B4F2F]/80 backdrop-blur-md border-2 border-[#C9A227] rounded-full">
                  <h2 
                    className="text-3xl md:text-4xl font-bold text-[#E6C847]"
                    style={{ fontFamily: 'var(--font-cinzel)' }}
                  >
                    {sceneName}
                  </h2>
                </div>
              </motion.div>

              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    x: Math.cos((i / 6) * Math.PI * 2) * 150,
                    y: Math.sin((i / 6) * Math.PI * 2) * 150,
                    scale: [0, 1.5, 0],
                  }}
                  transition={{ 
                    delay: 1 + i * 0.1,
                    duration: 1.5,
                    ease: 'easeOut',
                  }}
                  className="absolute left-1/2 top-1/2 w-3 h-3 bg-[#C9A227] rounded-full"
                  style={{
                    boxShadow: '0 0 16px 6px rgba(201, 162, 39, 0.6)',
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
