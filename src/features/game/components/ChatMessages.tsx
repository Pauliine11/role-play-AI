'use client';

import { ChatMessage } from '@/shared/types';
import { TypewriterText } from './TypewriterText';
import { MagicBreath } from './MagicBreath';
import { motion } from 'framer-motion';
import { useAnimationPreferences } from '@/shared/providers/AnimationPreferencesContext';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isPending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ messages, isPending, messagesEndRef }: ChatMessagesProps) {
  const { enableTypewriter, enableMagicEffects } = useAnimationPreferences();
  
  const lastAssistantIndex = messages.map((m, i) => ({ role: m.role, index: i }))
    .filter(m => m.role === 'assistant')
    .pop()?.index;

  return (
    <div data-testid="chat-messages" className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      {messages.map((msg, idx) => {
        const isLastAssistantMessage = msg.role === 'assistant' && idx === lastAssistantIndex;
        
        return (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1],
              delay: idx * 0.05 
            }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <motion.div 
              data-testid={msg.role === 'assistant' ? 'assistant-message' : 'user-message'}
              initial={msg.role === 'user' ? { 
                boxShadow: '0 0 0 0 rgba(201, 162, 39, 0)' 
              } : undefined}
              animate={msg.role === 'user' ? {
                boxShadow: [
                  '0 0 0 0 rgba(201, 162, 39, 0)',
                  '0 0 20px 4px rgba(201, 162, 39, 0.6)',
                  '0 0 12px 2px rgba(201, 162, 39, 0.3)',
                ]
              } : undefined}
              transition={msg.role === 'user' ? {
                duration: 0.8,
                times: [0, 0.5, 1],
                ease: 'easeOut'
              } : undefined}
              className={`
              max-w-[80%] p-4 rounded-xl text-sm md:text-base leading-relaxed relative
              ${msg.role === 'user' 
                ? 'bg-[#6B4F2F] text-[#E6D5A7] rounded-br-none shadow-lg border-2 border-[#C9A227]/50' 
                : 'bg-[#101827] text-[#E6D5A7] rounded-bl-none border-2 border-[#3A2F1E] shadow-lg'}
            `} style={{ fontFamily: 'var(--font-merriweather)' }}>
              {msg.role === 'assistant' && isLastAssistantMessage && enableMagicEffects && <MagicBreath />}
              <div className="relative z-10">
                {msg.role === 'assistant' && isLastAssistantMessage && enableTypewriter ? (
                  <TypewriterText 
                    text={msg.content} 
                    speed={30}
                    showParticles={enableMagicEffects}
                  />
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
      {isPending && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="bg-[#101827] p-4 rounded-xl rounded-bl-none border-2 border-[#3A2F1E] flex items-center gap-2 shadow-lg relative overflow-visible">
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-[#C9A227] rounded-full"
              style={{ 
                boxShadow: '0 0 8px 2px rgba(201, 162, 39, 0.4)',
              }}
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
              className="w-2 h-2 bg-[#C9A227] rounded-full"
              style={{ 
                boxShadow: '0 0 8px 2px rgba(201, 162, 39, 0.4)',
              }}
            />
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
              className="w-2 h-2 bg-[#C9A227] rounded-full"
              style={{ 
                boxShadow: '0 0 8px 2px rgba(201, 162, 39, 0.4)',
              }}
            />
          </div>
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
