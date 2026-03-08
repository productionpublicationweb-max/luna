'use client';

import { cn } from '@/lib/utils';
import LunaAvatar from './LunaAvatar';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export function MessageBubble({ message, isTyping }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <LunaAvatar size="sm" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser
            ? 'glass-gold text-golden-ivory'
            : 'glass text-golden-ivory'
        )}
      >
        {isTyping ? (
          <div className="typing-dots py-2">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
        
        {/* Timestamp */}
        <p
          className={cn(
            'text-xs mt-1 opacity-50',
            isUser ? 'text-right' : 'text-left'
          )}
        >
          {message.timestamp.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
