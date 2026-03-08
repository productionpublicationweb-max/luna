'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Sparkles } from 'lucide-react';
import MessageBubble, { Message } from './MessageBubble';
import LunaAvatar from './LunaAvatar';
import { LUNA_QUOTES } from '@/lib/luna-personality';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ messages, isLoading, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [randomQuote] = useState(() => LUNA_QUOTES[Math.floor(Math.random() * LUNA_QUOTES.length)]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isEmpty ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fade-in">
            <LunaAvatar size="lg" className="mb-6" />
            <h2 className="text-xl font-semibold text-golden-ivory mb-2">
              Bienvenue, âme curieuse
            </h2>
            <p className="text-light-lavender mb-6 max-w-md">
              Je suis Luna Monétis, ton oracle digitale. Pose-moi tes questions ou choisis une option ci-dessous pour commencer.
            </p>
            <div className="glass rounded-xl p-4 max-w-sm">
              <Sparkles className="w-5 h-5 text-gold-signature mx-auto mb-2" />
              <p className="text-sm text-muted-foreground italic">
                &ldquo;{randomQuote}&rdquo;
              </p>
            </div>
          </div>
        ) : (
          // Messages
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <MessageBubble 
                message={{
                  id: 'typing',
                  role: 'assistant',
                  content: '',
                  timestamp: new Date()
                }}
                isTyping
              />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 pb-4 pt-2">
        <form onSubmit={handleSubmit} className="relative">
          <div className="glass rounded-2xl p-2 flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pose ta question à Luna..."
              disabled={isLoading}
              className={cn(
                'flex-1 bg-transparent border-none resize-none text-golden-ivory',
                'placeholder:text-muted-foreground focus-visible:ring-0',
                'min-h-[44px] max-h-[120px] py-2.5 px-3'
              )}
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className={cn(
                'rounded-xl h-11 w-11 flex-shrink-0',
                'bg-gradient-to-r from-gold-signature to-gold-deep',
                'hover:from-gold-light hover:to-gold-signature',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200'
              )}
            >
              <Send className="w-5 h-5 text-dark-space-bg" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Appuie sur Entrée pour envoyer, Maj+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  );
}

export default ChatInterface;
