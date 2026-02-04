import { NextResponse } from 'next/server';
import { supabase } from '@/shared/lib/supabase';
import { levelSchema } from '@/features/levels/level';
// import { auth } from '@clerk/nextjs/server'; // Optionnel

/**
 * GET /api/levels - Récupère tous les niveaux
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch levels', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('❌ Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/levels - Crée un nouveau niveau
 */
export async function POST(request: Request) {
  try {
    // Vérification optionnelle de l'authentification
    // Décommentez si vous voulez restreindre l'accès aux utilisateurs connectés
    // const { userId } = await auth();
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();

    // Validation avec Zod
    const validation = levelSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validation.error.issues.map((i) => i.message).join(', '),
        },
        { status: 400 }
      );
    }

    const { title, description, order_index, content, is_active } = validation.data;

    // Insertion dans Supabase
    const { data, error } = await supabase
      .from('levels')
      .insert([
        {
          title,
          description,
          order_index,
          content,
          is_active,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create level', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data, message: 'Level created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Unexpected error in POST /api/levels:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
