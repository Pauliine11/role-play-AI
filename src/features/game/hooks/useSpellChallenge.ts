import { useState, useEffect, useRef, useCallback } from 'react';
import type { Challenge, ChallengeResult } from '@/shared/types/challenge';
import { XP_BONUS, HINT_REVEAL_CHANCE } from '@/shared/types/challenge';

interface Point {
  x: number;
  y: number;
}

interface UseSpellChallengeOptions {
  challenge: Challenge;
  onComplete: (result: ChallengeResult) => void;
  onFail: () => void;
}

export function useSpellChallenge({ challenge, onComplete, onFail }: UseSpellChallengeOptions) {
  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(challenge.duration);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [checkpointsValidated, setCheckpointsValidated] = useState<boolean[]>(
    new Array(challenge.controlPoints).fill(false)
  );
  const [lives, setLives] = useState(3);
  const [showSpeedWarning, setShowSpeedWarning] = useState(false);
  
  const startTimeRef = useRef<number>(0);
  const circleRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastMousePosRef = useRef<Point>({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef<number>(0);

  const centerX = 300;
  const centerY = 300;
  const radius = 120;

  const getControlPoints = useCallback((): Point[] => {
    const points: Point[] = [];
    const angleStep = (Math.PI * 2) / challenge.controlPoints;
    
    for (let i = 0; i < challenge.controlPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    }
    
    return points;
  }, [challenge.controlPoints]);

  const controlPoints = getControlPoints();

  const _getAngleFromMouse = useCallback((mouseX: number, mouseY: number): number => {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;
    return angle;
  }, []);

  const getDistanceFromCircle = useCallback((mouseX: number, mouseY: number): number => {
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return Math.abs(distance - radius);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!circleRef.current || !isActive) return;

    const rect = circleRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePosition({ x: mouseX, y: mouseY });

    const distance = getDistanceFromCircle(mouseX, mouseY);

    // Vérifier si on est proche du cercle pour commencer
    if (!hasStarted && distance <= challenge.tolerance) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
      lastMoveTimeRef.current = Date.now();
      lastMousePosRef.current = { x: mouseX, y: mouseY };
    }

    // Ne vérifier la sortie de zone QUE si le joueur a commencé
    if (hasStarted && distance > challenge.tolerance) {
      setFailed(true);
      setIsActive(false);
      onFail();
      return;
    }

    // Calculer la progression seulement si démarré
    if (hasStarted) {
      // Vérifier la vitesse de la souris
      const now = Date.now();
      const deltaTime = now - lastMoveTimeRef.current;
      const deltaX = mouseX - lastMousePosRef.current.x;
      const deltaY = mouseY - lastMousePosRef.current.y;
      const distanceMoved = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const speed = deltaTime > 0 ? (distanceMoved / deltaTime) * 1000 : 0; // px/s

      // Si trop rapide (> 800px/s), warning et perte de vie
      if (speed > 800) {
        setShowSpeedWarning(true);
        setTimeout(() => setShowSpeedWarning(false), 500);
        
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setFailed(true);
            setIsActive(false);
            onFail();
          }
          return newLives;
        });
      }

      lastMoveTimeRef.current = now;
      lastMousePosRef.current = { x: mouseX, y: mouseY };

      // Vérifier les checkpoints
      controlPoints.forEach((point, index) => {
        if (index === currentCheckpoint && !checkpointsValidated[index]) {
          const distanceToCheckpoint = Math.sqrt(
            Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)
          );

          // Si on passe sur le checkpoint actif (rayon de 20px)
          if (distanceToCheckpoint < 20) {
            setCheckpointsValidated(prev => {
              const newValidated = [...prev];
              newValidated[index] = true;
              return newValidated;
            });
            setCurrentCheckpoint(index + 1);
            
            // Calculer progression basée sur les checkpoints validés
            const validatedCount = index + 1;
            const newProgress = (validatedCount / challenge.controlPoints) * 100;
            setProgress(newProgress);

            // Si tous les checkpoints sont validés
            if (validatedCount === challenge.controlPoints) {
              setIsActive(false);
              const completionTime = Date.now() - startTimeRef.current;
              
              const hintRevealed = Math.random() < HINT_REVEAL_CHANCE;
              
              const result: ChallengeResult = {
                success: true,
                xpBonus: XP_BONUS,
                hintRevealed,
                completionTime,
              };

              onComplete(result);
            }
          }
        }
      });
    }
  }, [isActive, hasStarted, challenge.tolerance, challenge.controlPoints, currentCheckpoint, checkpointsValidated, controlPoints, getDistanceFromCircle, onComplete, onFail]);

  useEffect(() => {
    setIsActive(true);
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 100) {
          setFailed(true);
          setIsActive(false);
          onFail();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    
    timerRef.current = timer;
    const currentFrameId = animationFrameRef.current;

    return () => {
      clearInterval(timer);
      if (currentFrameId) cancelAnimationFrame(currentFrameId);
    };
  }, [onFail]);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isActive, handleMouseMove]);

  return {
    mousePosition,
    progress,
    isActive,
    hasStarted,
    failed,
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
  };
}
