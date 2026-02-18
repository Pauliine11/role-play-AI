'use client';

import { FormEvent } from 'react';
import { Button } from '@/shared/components/ui/button';

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSendMessage: (e?: FormEvent, forcedText?: string) => void;
  isPending: boolean;
  gameOver: boolean;
  gameWon: boolean;
  suggestedActions?: string[];
  character: string;
  t: (key: string) => string;
}

export function ChatInput({
  inputText,
  setInputText,
  onSendMessage,
  isPending,
  gameOver,
  gameWon,
  suggestedActions,
  character,
  t
}: ChatInputProps) {
  return (
    <>
      {/* Suggestions de dialogue */}
      {!gameOver && !gameWon && suggestedActions && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
          {suggestedActions.map((action, i) => (
            <Button
              key={i}
              variant="suggestion"
              size="sm"
              onClick={() => onSendMessage(undefined, action)}
              disabled={isPending}
              style={{ fontFamily: 'var(--font-merriweather)' }}
            >
              {action}
            </Button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-[#0E1320]/70 border-t-2 border-[#3A2F1E]">
        <form onSubmit={onSendMessage} className="relative">
          <input
            data-testid="message-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`${t('rpg.inputPlaceholder')} ${character.split(' ')[0]} ?`}
            className="w-full bg-[#141B2D] text-[#E6D5A7] border-2 border-[#3A2F1E] rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227] placeholder-[#6B5A45] transition-all shadow-inner"
            style={{ fontFamily: 'var(--font-merriweather)' }}
            disabled={isPending || gameOver || gameWon}
          />
          <Button
            data-testid="send-button"
            type="submit"
            variant="icon"
            disabled={!inputText.trim() || isPending || gameOver || gameWon}
            className="absolute right-2 top-2 bottom-2 px-0"
          >
            ➤
          </Button>
        </form>
      </div>
    </>
  );
}
