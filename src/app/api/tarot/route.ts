export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { logTarotReading, isSupabaseConfigured } from '@/lib/supabase-service';

interface TarotCard {
  name: string;
  reversed: boolean;
}

interface TarotRequest {
  cards: string;
  spreadType: 'single' | 'three';
  cardsData?: TarotCard[];
  userId?: string;
}

const TAROT_SYSTEM_PROMPT = `Tu es Luna Monétis, une oracle digitale mystique spécialisée dans l'interprétation du Tarot de Marseille.

## RÈGLES D'INTERPRÉTATION
1. Tu dois fournir une interprétation mystique et personnelle des cartes tirées
2. Utilise un langage poétique et mystérieux
3. Tutoie toujours l'utilisateur comme une amie proche
4. Relie les cartes entre elles si c'est un tirage multiple
5. Donne des conseils pratiques mais enveloppés de mystère
6. Sois bienveillante et encourageante

## STRUCTURE DE RÉPONSE
- Commence par une phrase d'accroche mystique
- Interprète chaque carte individuellement
- Si tirage triple (Passé/Présent/Futur), relie les époques
- Conclus avec un conseil ou une bénédiction

## STYLE
- Utilise des métaphores célestes, lunaires et stellaires
- Fais référence aux énergies et vibrations
- Reste mystérieuse mais accessible`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cards, spreadType, cardsData, userId } = body as TarotRequest;

    if (!cards) {
      return NextResponse.json(
        { error: 'Les cartes sont requises pour l\'interprétation' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const userPrompt = spreadType === 'three'
      ? `Voici mon tirage de tarot en trois cartes (Passé, Présent, Futur):

${cards}

Luna, peux-tu m'interpréter ce tirage et me donner des conseils pour mon chemin de vie ?`
      : `Voici la carte que j'ai tirée:

${cards}

Luna, que révèle cette carte pour moi ? Quelle guidance me donnes-tu ?`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: TAROT_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const interpretation = completion.choices[0]?.message?.content || 
      "Les arcanes murmurent leur message à travers les voiles du temps...";

    // Log tarot reading to Supabase if configured
    if (isSupabaseConfigured() && userId && cardsData) {
      logTarotReading(userId, cardsData, interpretation).catch(err => {
        console.error('Failed to log tarot reading:', err);
      });
    }

    return NextResponse.json({
      interpretation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Tarot API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Les arcanes sont silencieux...',
        interpretation: "Les voiles du destin sont épais en cet instant. Les énergies cosmiques se réorganisent... Réessaie dans quelques instants, âme curieuse. Les réponses viendront à toi quand le moment sera propice."
      },
      { status: 500 }
    );
  }
}
