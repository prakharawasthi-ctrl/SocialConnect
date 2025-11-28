// src/app/api/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  console.log('=== SUGGESTIONS API - Finding users you are NOT following ===');
  
  try {
    // Get the authorization token from headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('ERROR: No valid auth header');
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('ERROR: Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Get the current user from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('User auth error:', userError?.message);
      return NextResponse.json(
        { error: 'Invalid token', details: userError?.message },
        { status: 401 }
      );
    }

    console.log('✓ Current User ID:', user.id);

    // Step 1: Get all users that the current user is FOLLOWING
    const { data: followingData, error: followingError } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', user.id);

    if (followingError) {
      console.error('Error fetching following list:', followingError.message);
      return NextResponse.json(
        { error: 'Failed to fetch following list', details: followingError.message },
        { status: 500 }
      );
    }

    // Get list of IDs the user is following
    const followingIds = followingData?.map(f => f.following_id) || [];
    console.log('✓ You are following:', followingIds.length, 'users');
    console.log('  Following IDs:', followingIds);

    // Step 2: Get ALL users from the database
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, username, first_name, last_name, avatar_url, bio');

    if (usersError) {
      console.error('Error fetching all users:', usersError.message);
      return NextResponse.json(
        { error: 'Failed to fetch users', details: usersError.message },
        { status: 500 }
      );
    }

    console.log('✓ Total users in database:', allUsers?.length || 0);

    // Step 3: Filter out:
    // - Current user (yourself)
    // - Users you are already following
    const suggestedUsers = allUsers?.filter(u => {
      const isCurrentUser = u.id === user.id;
      const isFollowing = followingIds.includes(u.id);
      
      // We want users that are NOT the current user AND NOT being followed
      return !isCurrentUser && !isFollowing;
    }) || [];

    console.log('✓ Users NOT following (suggestions):', suggestedUsers.length);
    
    if (suggestedUsers.length > 0) {
      console.log('  Suggested users:');
      suggestedUsers.slice(0, 5).forEach(u => {
        console.log(`    - ${u.first_name} ${u.last_name} (@${u.username})`);
      });
    } else {
      console.log('  ⚠️ No suggestions available (you might be following everyone!)');
    }

    console.log('=== SUGGESTIONS API SUCCESS ===');

    // Return up to 10 suggestions
    return NextResponse.json({
      users: suggestedUsers.slice(0, 10),
      total: suggestedUsers.length,
      debug: {
        currentUserId: user.id,
        totalUsersInDB: allUsers?.length || 0,
        followingCount: followingIds.length,
        suggestedCount: suggestedUsers.length,
        explanation: 'These are users you are NOT following'
      }
    });

  } catch (error) {
    console.error('=== UNEXPECTED ERROR ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}