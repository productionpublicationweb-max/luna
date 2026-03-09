import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { LUNA_SYSTEM_PROMPT } from '@/lib/luna-personality';
import { logChat, isSupabaseConfigured } from '@/lib/supabase-service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, userId } = body as ChatRequest;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Build the messages array with system prompt
    const systemMessage: ChatMessage = {
      role: 'system',
      content: LUNA_SYSTEM_PROMPT
    };

    const allMessages = [systemMessage, ...messages];

    const completion = await zai.chat.completions.create({
      messages: allMessages,
      temperature: 0.8,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 
      "Les étoiles sont voilées pour le moment... Reformule ta question, âme curieuse.";

    // Log chat to Supabase if configured and user is provided
    if (isSupabaseConfigured() && userId) {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      if (lastUserMessage) {
        // Log asynchronously without waiting
        logChat(userId, lastUserMessage.content, assistantMessage).catch(err => {
          console.error('Failed to log chat:', err);
        });
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Une perturbation cosmique a eu lieu...',
        message: "Les énergies sont instables pour le moment. Réessaie dans quelques instants, âme curieuse."
      },
      { status: 500 }
    );
  }
}
