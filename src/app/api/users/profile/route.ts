// // src/app/api/users/profile/route.ts
// // DEBUG VERSION - This will show us what's happening

// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/superbase/client';

// export async function PATCH(request: NextRequest) {
//   try {
//     console.log('========================================');
//     console.log('🔄 Profile update request received');
//     console.log('========================================');
    
//     // Get the authorization token from the request headers
//     const authHeader = request.headers.get('authorization');
//     console.log('📋 Auth header present:', !!authHeader);
//     console.log('📋 Auth header value:', authHeader?.substring(0, 20) + '...');
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       console.error('❌ No authorization header found');
//       return NextResponse.json(
//         { error: 'Unauthorized - No token provided' },
//         { status: 401 }
//       );
//     }

//     const token = authHeader.replace('Bearer ', '');
//     console.log('🔑 Token length:', token.length);
//     console.log('🔑 Token start:', token.substring(0, 20) + '...');

//     // Try to get user from Supabase using the token
//     console.log('🔍 Attempting Supabase auth.getUser...');
//     const { data: authData, error: authError } = await supabase.auth.getUser(token);
    
//     console.log('📊 Auth result:', {
//       hasUser: !!authData?.user,
//       userId: authData?.user?.id,
//       hasError: !!authError,
//       errorMessage: authError?.message
//     });

//     if (authError) {
//       console.error('❌ Supabase auth error:', authError);
//       return NextResponse.json(
//         { error: 'Unauthorized - Invalid token', details: authError.message },
//         { status: 401 }
//       );
//     }

//     if (!authData?.user) {
//       console.error('❌ No user data returned');
//       return NextResponse.json(
//         { error: 'Unauthorized - No user found' },
//         { status: 401 }
//       );
//     }

//     const userId = authData.user.id;
//     console.log('✅ User authenticated:', userId);

//     // Get the update data from request body
//     const body = await request.json();
//     console.log('📝 Update data received:', body);
    
//     const { first_name, last_name, username, bio, avatar_url } = body;

//     // Validate required fields
//     if (!first_name?.trim() || !last_name?.trim() || !username?.trim()) {
//       console.log('❌ Validation failed: missing required fields');
//       return NextResponse.json(
//         { error: 'First name, last name, and username are required' },
//         { status: 400 }
//       );
//     }

//     // Check if username is already taken by another user
//     console.log('🔍 Checking username availability...');
//     const { data: existingUser } = await supabase
//       .from('users')
//       .select('id')
//       .eq('username', username.trim())
//       .neq('id', userId)
//       .maybeSingle();

//     if (existingUser) {
//       console.log('❌ Username already taken by user:', existingUser.id);
//       return NextResponse.json(
//         { error: 'Username is already taken' },
//         { status: 400 }
//       );
//     }

//     console.log('🔄 Updating user profile in database...');

//     // Update user profile in Supabase
//     const { data, error } = await supabase
//       .from('users')
//       .update({
//         first_name: first_name.trim(),
//         last_name: last_name.trim(),
//         username: username.trim(),
//         bio: bio?.trim() || null,
//         avatar_url: avatar_url?.trim() || null,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', userId)
//       .select()
//       .single();

//     if (error) {
//       console.error('❌ Database update error:', error);
//       return NextResponse.json(
//         { error: 'Failed to update profile', details: error.message },
//         { status: 500 }
//       );
//     }

//     console.log('✅ Profile updated successfully');
//     console.log('========================================');

//     return NextResponse.json({
//       success: true,
//       user: data
//     });

//   } catch (error: any) {
//     console.error('🔥 Unexpected error in profile update:', error);
//     console.error('🔥 Error stack:', error.stack);
//     return NextResponse.json(
//       { error: 'Internal server error', details: error.message },
//       { status: 500 }
//     );
//   }
// }

// // Also support PUT method for compatibility
// export async function PUT(request: NextRequest) {
//   return PATCH(request);
// }

// src/app/api/users/profile/route.ts
// Uses your existing withAuth middleware

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase/client';
import { withAuth } from '@/lib/auth/middleware';

async function handler(req: NextRequest) {
  try {
    console.log('========================================');
    console.log('🔄 Profile update request received');
    
    // Get user ID from the decoded JWT (set by withAuth middleware)
    const user = (req as any).user;
    const userId = user.userId || user.sub || user.id;
    
    console.log('✅ User authenticated:', userId);

    if (!userId) {
      console.error('❌ No user ID found in token');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid user data' },
        { status: 401 }
      );
    }

    // Get the update data from request body
    const body = await req.json();
    console.log('📝 Update data:', Object.keys(body));
    
    const { first_name, last_name, username, bio, avatar_url } = body;

    // Validate required fields
    if (!first_name?.trim() || !last_name?.trim() || !username?.trim()) {
      return NextResponse.json(
        { error: 'First name, last name, and username are required' },
        { status: 400 }
      );
    }

    // Check if username is already taken by another user
    console.log('🔍 Checking username availability...');
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.trim())
      .neq('id', userId)
      .maybeSingle();

    if (existingUser) {
      console.log('❌ Username already taken');
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
    }

    console.log('🔄 Updating user profile in database...');

    // Update user profile in Supabase
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        username: username.trim(),
        bio: bio?.trim() || null,
        avatar_url: avatar_url?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Database update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile: ' + error.message },
        { status: 500 }
      );
    }

    console.log('✅ Profile updated successfully');
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
export const PATCH = withAuth(handler);
export const PUT = withAuth(handler); // Support PUT method too