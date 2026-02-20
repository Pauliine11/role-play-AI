/**
 * =============================================================================
 * HOOK - MUSIQUE DE FOND PAR NIVEAU
 * =============================================================================
 * 
 * Hook pour gérer la musique de fond immersive dans le jeu.
 * Chaque niveau/personnage a sa propre ambiance musicale.
 * 
 * FONCTIONNALITÉS :
 * - Lecture automatique au chargement du niveau
 * - Loop infini
 * - Fade in/out lors des changements
 * - Contrôles : play, pause, volume
 * - Persistance des préférences utilisateur
 * 
 * =============================================================================
 */

'use client';

import { useEffect, useRef, useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface MusicConfig {
  src: string;
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

interface UseBackgroundMusicOptions {
  autoPlay?: boolean;
  defaultVolume?: number;
  persistPreferences?: boolean;
}

interface UseBackgroundMusicReturn {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  changeMusic: (musicSrc: string, fadeOut?: boolean) => void;
}

// ============================================================================
// CONFIGURATION PAR PERSONNAGE
// ============================================================================

/**
 * Mapping des musiques de fond par personnage
 * 
 * Ambiances :
 * - Hagrid : Forêt mystérieuse, nature magique
 * - Hermione : Bibliothèque studieuse, intelligence
 * - Ron : Aventure légère, camaraderie
 * - Luna : Rêverie, mystère doux
 */
export const MUSIC_BY_CHARACTER: Record<string, string> = {
  hagrid: '/music/hagrid-forest.mp3',
  hermione: '/music/hermione-library.mp3',
  ron: '/music/ron-adventure.mp3',
  luna: '/music/luna-dreamy.mp3',
  default: '/music/hogwarts-ambient.mp3',
};

/**
 * Obtenir le chemin de la musique pour un personnage
 */
export function getMusicForCharacter(character: string): string {
  const normalized = character.toLowerCase();
  
  if (normalized.includes('hagrid')) return MUSIC_BY_CHARACTER.hagrid;
  if (normalized.includes('hermione')) return MUSIC_BY_CHARACTER.hermione;
  if (normalized.includes('ron')) return MUSIC_BY_CHARACTER.ron;
  if (normalized.includes('luna')) return MUSIC_BY_CHARACTER.luna;
  
  return MUSIC_BY_CHARACTER.default;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook pour gérer la musique de fond du jeu
 * 
 * @param musicSrc - Chemin vers le fichier audio
 * @param options - Options de configuration
 * 
 * @example
 * const { isPlaying, togglePlay, setVolume } = useBackgroundMusic(
 *   getMusicForCharacter('Hagrid'),
 *   { autoPlay: true, defaultVolume: 0.3 }
 * );
 */
export function useBackgroundMusic(
  musicSrc: string,
  options: UseBackgroundMusicOptions = {}
): UseBackgroundMusicReturn {
  const {
    autoPlay = true,
    defaultVolume = 0.3,
    persistPreferences = true,
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [isMuted, setIsMuted] = useState(false);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialiser l'audio
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Charger les préférences
    if (persistPreferences) {
      const savedVolume = localStorage.getItem('game-music-volume');
      const savedMuted = localStorage.getItem('game-music-muted');
      
      if (savedVolume) setVolumeState(parseFloat(savedVolume));
      if (savedMuted) setIsMuted(savedMuted === 'true');
    }

    // Créer l'élément audio
    const audio = new Audio(musicSrc);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    // Auto-play avec fade in
    if (autoPlay) {
      audio.volume = 0;
      audio.play()
        .then(() => {
          setIsPlaying(true);
          fadeIn(audio, isMuted ? 0 : volume, 2000);
        })
        .catch((error) => {
          console.warn('Autoplay bloqué par le navigateur:', error);
        });
    }

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicSrc]);

  // Mettre à jour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    
    if (persistPreferences) {
      localStorage.setItem('game-music-volume', volume.toString());
      localStorage.setItem('game-music-muted', isMuted.toString());
    }
  }, [volume, isMuted, persistPreferences]);

  // Fade in
  const fadeIn = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    
    const steps = 50;
    const stepDuration = duration / steps;
    const volumeIncrement = targetVolume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        audio.volume = targetVolume;
        return;
      }
      
      audio.volume = Math.min(volumeIncrement * currentStep, targetVolume);
      currentStep++;
    }, stepDuration);
  };

  // Fade out
  const fadeOut = (audio: HTMLAudioElement, duration: number, callback?: () => void) => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    
    const steps = 50;
    const stepDuration = duration / steps;
    const initialVolume = audio.volume;
    const volumeDecrement = initialVolume / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (currentStep >= steps) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        audio.volume = 0;
        audio.pause();
        if (callback) callback();
        return;
      }
      
      audio.volume = Math.max(initialVolume - (volumeDecrement * currentStep), 0);
      currentStep++;
    }, stepDuration);
  };

  // Actions
  const play = () => {
    if (!audioRef.current) return;
    
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        fadeIn(audioRef.current!, isMuted ? 0 : volume, 1000);
      })
      .catch((error) => {
        console.warn('Lecture audio échouée:', error);
      });
  };

  const pause = () => {
    if (!audioRef.current) return;
    
    fadeOut(audioRef.current, 1000, () => {
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const changeMusic = (newMusicSrc: string, shouldFade = true) => {
    if (!audioRef.current) return;

    if (shouldFade && isPlaying) {
      fadeOut(audioRef.current, 1000, () => {
        if (audioRef.current) {
          audioRef.current.src = newMusicSrc;
          audioRef.current.load();
          play();
        }
      });
    } else {
      audioRef.current.src = newMusicSrc;
      audioRef.current.load();
      if (isPlaying) play();
    }
  };

  return {
    isPlaying,
    volume,
    isMuted,
    play,
    pause,
    togglePlay,
    setVolume,
    toggleMute,
    changeMusic,
  };
}
