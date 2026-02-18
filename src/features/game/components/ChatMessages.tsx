'use client';

import { ChatMessage } from '@/shared/types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isPending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({ messages, isPending, messagesEndRef }: ChatMessagesProps) {
  return (
    <div data-testid="chat-messages" className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div 
            data-testid={msg.role === 'assistant' ? 'assistant-message' : 'user-message'}
            className={`
            max-w-[80%] p-4 rounded-xl text-sm md:text-base leading-relaxed
            ${msg.role === 'user' 
              ? 'bg-[#6B4F2F] text-[#E6D5A7] rounded-br-none shadow-lg border-2 border-[#C9A227]/50' 
              : 'bg-[#101827] text-[#E6D5A7] rounded-bl-none border-2 border-[#3A2F1E] shadow-lg'}
          `} style={{ fontFamily: 'var(--font-merriweather)' }}>
            {msg.content}
          </div>
        </div>
      ))}
      {isPending && (
        <div className="flex justify-start">
          <div className="bg-[#101827] p-4 rounded-xl rounded-bl-none border-2 border-[#3A2F1E] flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 bg-[#C9A227] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#C9A227] rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-[#C9A227] rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
