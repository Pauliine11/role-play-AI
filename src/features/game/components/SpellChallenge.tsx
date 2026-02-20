'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSpellChallenge } from '../hooks/useSpellChallenge';
import type { Challenge, ChallengeResult } from '@/shared/types/challenge';
import { EnemyDisplay } from './spell-challenge/EnemyDisplay';
import { TimeBar } from './spell-challenge/TimeBar';
import { Instructions } from './spell-challenge/Instructions';
import { CircleCanvas } from './spell-challenge/CircleCanvas';

interface SpellChallengeProps {
  challenge: Challenge;
  onComplete: (result: ChallengeResult) => void;
  onFail: () => void;
}

export function SpellChallenge({ challenge, onComplete, onFail }: SpellChallengeProps) {
  const {
    mousePosition,
    progress,
    isActive,
    hasStarted,
    timeRemaining,
    controlPoints,
    centerX,
    centerY,
    radius,
    circleRef,
    currentCheckpoint,
    checkpointsValidated,
    lives,
    showSpeedWarning,
  } = useSpellChallenge({ challenge, onComplete, onFail });

  const timePercentage = (timeRemaining / challenge.duration) * 100;
  const enemyProximity = hasStarted ? ((challenge.duration - timeRemaining) / challenge.duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute left-12 bottom-12 text-8xl filter drop-shadow-2xl"
          >
            🧙‍♂️
          </motion.div>

          <EnemyDisplay 
            challengeType={challenge.type}
            hasStarted={hasStarted}
            enemyProximity={enemyProximity}
          />

          <div className="relative" ref={circleRef} style={{ width: 600, height: 600 }}>
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute -top-32 left-1/2 -translate-x-1/2 text-center w-full"
            >
              <h2 
                className="text-4xl font-bold mb-3 text-[#C9A227]" 
                style={{ fontFamily: 'var(--font-cinzel)', textShadow: '0 0 20px rgba(201,162,39,0.8)' }}
              >
                {challenge.description}
              </h2>
              <p 
                className="text-2xl text-[#E6D5A7]" 
                style={{ fontFamily: 'var(--font-merriweather)' }}
              >
                Lancez <span className="text-[#C9A227] font-bold">{challenge.spell}</span> !
              </p>
              
              {!hasStarted && (
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-4 text-lg text-[#B8A77E]"
                  style={{ fontFamily: 'var(--font-merriweather)' }}
                >
                  Cliquez pour commencer
                </motion.p>
              )}
            </motion.div>

            <CircleCanvas
              centerX={centerX}
              centerY={centerY}
              radius={radius}
              progress={progress}
              isActive={isActive}
              controlPoints={controlPoints}
              currentCheckpoint={currentCheckpoint}
              checkpointsValidated={checkpointsValidated}
            />

            {isActive && mousePosition && (
              <motion.div
                className="absolute w-6 h-6 bg-[#E6C847] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_20px_rgba(230,200,71,0.8)]"
                style={{
                  left: mousePosition.x,
                  top: mousePosition.y,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}

            {showSpeedWarning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-6 py-3 rounded-lg font-bold text-center shadow-lg"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                ⚠️ Trop rapide ! Ralentissez !
              </motion.div>
            )}
          </div>

          <TimeBar timePercentage={timePercentage} />

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8 items-center">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-10 h-10 rounded-full ${i < lives ? 'bg-red-600' : 'bg-gray-700'} border-2 ${i < lives ? 'border-red-400' : 'border-gray-500'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="flex items-center justify-center text-2xl h-full">
                    {i < lives ? '❤️' : '🖤'}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="text-2xl font-bold text-[#E6D5A7]"
              style={{ fontFamily: 'var(--font-cinzel)' }}
            >
              {Math.round(progress)}%
            </motion.div>

            <motion.div
              className={`text-3xl font-bold ${timePercentage < 30 ? 'text-red-500' : 'text-[#C9A227]'}`}
              style={{ fontFamily: 'var(--font-cinzel)' }}
              animate={timePercentage < 30 ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {timeRemaining}s
            </motion.div>
          </div>

          <Instructions hasStarted={hasStarted} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
