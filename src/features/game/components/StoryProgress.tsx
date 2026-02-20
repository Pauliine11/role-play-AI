import React from 'react';
import { useStoryProgression } from '@/features/game/hooks/useStoryProgression';
import { StoryLevel } from '@/shared/types/game';

export const StoryProgress = () => {
  const { levels, currentLevel, progressPercentage } = useStoryProgression();

  return (
    <div className="bg-[#141B2D] border-4 border-[#C9A227] rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#C9A227] drop-shadow-lg" style={{ fontFamily: 'var(--font-cinzel)', letterSpacing: '0.05em' }}>Grimoire de Progression</h2>
        <span className="text-[#E6D5A7] text-sm font-bold px-3 py-1 bg-[#6B4F2F] border-2 border-[#C9A227] rounded-full shadow-lg" style={{ fontFamily: 'var(--font-cinzel)' }}>{Math.round(progressPercentage)}% complété</span>
      </div>

      <div className="w-full bg-[#3A2F1E] rounded-full h-3 mb-6 shadow-inner border border-[#2a1f0e]">
        <div 
          className="bg-gradient-to-r from-[#C9A227] to-[#E6C847] h-3 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(201,162,39,0.5)]" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="space-y-4">
        {levels.map((level) => (
          <LevelItem key={level.id} level={level} isCurrent={currentLevel?.id === level.id} />
        ))}
      </div>
    </div>
  );
};

const LevelItem = ({ level, isCurrent }: { level: StoryLevel, isCurrent: boolean }) => {
  const getIcon = () => {
    switch (level.status) {
      case 'completed': return '✅';
      case 'locked': return '🔒';
      case 'unlocked': return '📜';
    }
  };

  const getOpacity = () => {
    if (level.status === 'locked') return 'opacity-50';
    return 'opacity-100';
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg transition-colors border-2 ${getOpacity()} ${isCurrent ? 'bg-[#6B4F2F]/30 border-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.2)]' : 'border-[#3A2F1E] bg-[#101827]/50'}`}>
      <span className="text-2xl" role="img" aria-label={level.status}>
        {getIcon()}
      </span>
      <div>
        <h3 className={`font-bold text-[#E6D5A7] ${level.status === 'completed' ? 'line-through decoration-[#B8A77E]' : ''}`} style={{ fontFamily: 'var(--font-cinzel)' }}>
          {level.title}
        </h3>
        <p className="text-[#B8A77E] text-sm leading-relaxed mt-1" style={{ fontFamily: 'var(--font-merriweather)' }}>
          {level.description}
        </p>
      </div>
    </div>
  );
};

