'use client';

import { motion } from 'framer-motion';
import { useAnimationPreferences } from '@/shared/providers/AnimationPreferencesContext';

export function AnimationSettings() {
  const {
    enableTypewriter,
    enableParticles,
    enableSceneTransitions,
    enableMagicEffects,
    reducedMotion,
    setEnableTypewriter,
    setEnableParticles,
    setEnableSceneTransitions,
    setEnableMagicEffects,
    toggleAll,
  } = useAnimationPreferences();

  const settings = [
    {
      id: 'typewriter',
      label: 'Machine à écrire',
      description: 'Texte apparaît lettre par lettre',
      icon: '✍️',
      enabled: enableTypewriter,
      onChange: setEnableTypewriter,
    },
    {
      id: 'particles',
      label: 'Particules magiques',
      description: 'Particules dorées flottantes',
      icon: '✨',
      enabled: enableParticles,
      onChange: setEnableParticles,
    },
    {
      id: 'transitions',
      label: 'Transitions de scène',
      description: 'Illustrations des lieux',
      icon: '🎬',
      enabled: enableSceneTransitions,
      onChange: setEnableSceneTransitions,
    },
    {
      id: 'effects',
      label: 'Effets magiques',
      description: 'Explosions et lueurs',
      icon: '💫',
      enabled: enableMagicEffects,
      onChange: setEnableMagicEffects,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#C9A227]" style={{ fontFamily: 'var(--font-cinzel)' }}>
            ⚙️ Préférences d&apos;animation
          </h3>
          <p className="text-sm text-[#B8A77E]" style={{ fontFamily: 'var(--font-merriweather)' }}>
            Personnalisez les effets visuels
          </p>
        </div>
        
        <button
          onClick={() => toggleAll(!enableTypewriter || !enableParticles)}
          className="px-4 py-2 bg-[#6B4F2F] hover:bg-[#8C6A3F] text-[#E6D5A7] rounded-lg border border-[#3A2F1E] hover:border-[#C9A227] transition-all text-sm font-medium"
        >
          {enableTypewriter && enableParticles ? 'Tout désactiver' : 'Tout activer'}
        </button>
      </div>

      {reducedMotion && (
        <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg mb-4">
          <p className="text-blue-400 text-sm flex items-center gap-2">
            <span>ℹ️</span>
            <span>Mouvement réduit détecté (paramètres système)</span>
          </p>
        </div>
      )}

      <div className="space-y-3">
        {settings.map((setting) => (
          <motion.div
            key={setting.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              setting.enabled
                ? 'bg-[#6B4F2F]/30 border-[#C9A227]'
                : 'bg-[#141B2D] border-[#3A2F1E]'
            }`}
            onClick={() => setting.onChange(!setting.enabled)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{setting.icon}</div>
                <div>
                  <p className="font-medium text-[#E6D5A7]" style={{ fontFamily: 'var(--font-merriweather)' }}>
                    {setting.label}
                  </p>
                  <p className="text-xs text-[#B8A77E]">
                    {setting.description}
                  </p>
                </div>
              </div>
              
              <div
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  setting.enabled ? 'bg-[#C9A227]' : 'bg-[#3A2F1E]'
                }`}
              >
                <motion.div
                  animate={{ x: setting.enabled ? 24 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-[#141B2D] border border-[#3A2F1E] rounded-lg">
        <p className="text-xs text-[#B8A77E]" style={{ fontFamily: 'var(--font-merriweather)' }}>
          💡 <strong>Astuce</strong>: Désactiver les animations réduit la consommation de batterie et améliore les performances sur les appareils moins puissants.
        </p>
      </div>
    </div>
  );
}
