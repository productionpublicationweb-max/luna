import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { logRuneReading, isSupabaseConfigured } from '@/lib/supabase-service';

interface RuneData {
  name: string;
  symbol: string;
  reversed: boolean;
}

interface RunesRequest {
  runes: string;
  spreadType: 'single' | 'three';
  runesData?: RuneData[];
  userId?: string;
}

const RUNES_SYSTEM_PROMPT = `Tu es Luna Monétis, une oracle digitale mystique spécialisée dans l'interprétation des runes anciennes du Futhark.

## RÈGLES D'INTERPRÉTATION
1. Tu dois fournir une interprétation mystique et personnelle des runes tirées
2. Utilise un langage poétique imprégné de sagesse nordique
3. Tutoie toujours l'utilisateur comme une amie proche
4. Relie les runes entre elles si c'est un tirage multiple
5. Donne des conseils pratiques mais enveloppés de mystère ancien
6. Sois bienveillante et encourageante

## STRUCTURE DE RÉPONSE
- Commence par une invocation aux anciens ou une phrase mystique
- Interprète chaque rune individuellement avec son énergie propre
- Si tirage triple (Situation/Défi/Guidance), relie les aspects
- Conclus avec une bénédiction nordique ou un conseil

## STYLE
- Utilise des métaphores liées à la nature, aux éléments, aux forces anciennes
- Fais référence aux énergies telluriques et cosmiques
- Parle de cycles, de saisons, de voyages intérieurs
- Reste mystérieuse mais accessible`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { runes, spreadType, runesData, userId } = body as RunesRequest;

    if (!runes) {
      return NextResponse.json(
        { error: 'Les runes sont requises pour l\'interprétation' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const userPrompt = spreadType === 'three'
      ? `Voici mon tirage de runes en trois positions (Situation, Défi, Guidance):

${runes}

Luna, peux-tu m'interpréter ce tirage et me guider sur mon chemin ?`
      : `Voici la rune que j'ai tirée:

${runes}

Luna, que révèle cette rune pour moi ? Quelle sagesse ancienne me transmet-elle ?`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: RUNES_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.85,
      max_tokens: 800,
    });

    const interpretation = completion.choices[0]?.message?.content || 
      "Les runes murmurent leur sagesse à travers les âges...";

    // Log rune reading to Supabase if configured
    if (isSupabaseConfigured() && userId && runesData) {
      logRuneReading(userId, runesData, interpretation).catch(err => {
        console.error('Failed to log rune reading:', err);
      });
    }

    return NextResponse.json({
      interpretation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Runes API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Les runes sont silencieuses...',
        interpretation: "Les anciens dieux nordiques gardent leur silence en cet instant. Les énergies telluriques se réorganisent... Réessaie dans quelques instants, voyageuse des étoiles. La sagesse viendra à toi quand le moment sera propice."
      },
      { status: 500 }
    );
  }
}
