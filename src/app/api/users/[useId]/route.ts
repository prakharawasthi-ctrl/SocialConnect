// CREATE THIS FILE: src/app/api/users/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase/client';
import { withAuth } from '@/lib/auth/middleware';

async function handler(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    console.log('========================================');
    console.log('🔄 Get user profile request received');
    
    const { userId } = params;
    console.log('📝 Fetching user ID:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user profile from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Database fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user profile: ' + error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User profile fetched successfully');
    console.log('  - Has bio:', !!data.bio);
    console.log('  - Has avatar:', !!data.avatar_url);
    console.log('========================================');

    return NextResponse.json({
      success: true,
      user: data
    });

  } catch (error: any) {
    console.error('🔥 Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// Wrap handler with authentication middleware
export const GET = withAuth(handler);