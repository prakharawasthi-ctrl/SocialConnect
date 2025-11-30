// CREATE THIS FILE: src/app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  try {
    console.log('========================================');
    console.log('📋 Get all users request received');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);
    
    // Get the authenticated user from the request
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.error('❌ No token provided');
      return NextResponse.json(
        { error: 'No authorization token' },
        { status: 401 }
      );
    }

    console.log('🔑 Token received, verifying...');

    // Verify token and get user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('❌ Auth error:', authError?.message || 'No user found');
      return NextResponse.json(
        { error: 'Unauthorized: ' + (authError?.message || 'Invalid token') },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // Check if user is admin
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('Current user role:', currentUser?.role);

    if (userError) {
      console.error('❌ Error fetching user role:', userError.message);
      return NextResponse.json(
        { error: 'Failed to verify admin status: ' + userError.message },
        { status: 500 }
      );
    }

    if (!currentUser || currentUser.role !== 'admin') {
      console.error('❌ User is not admin. Role:', currentUser?.role || 'none');
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    console.log('✅ Admin verified, fetching all users');

    // Fetch all users with their stats
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        email,
        username,
        first_name,
        last_name,
        avatar_url,
        bio,
        role,
        created_at,
        updated_at,
        followers_count,
        following_count,
        posts_count
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database fetch error:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch users: ' + error.message },
        { status: 500 }
      );
    }

    const userCount = users?.length || 0;
    console.log(`✅ Fetched ${userCount} users`);
    
    if (users && users.length > 0) {
      console.log('Sample user:', {
        id: users[0].id,
        username: users[0].username,
        role: users[0].role
      });
    }
    console.log('========================================');

    return NextResponse.json({
      success: true,
      users: users || [],
      total: userCount
    });

  } catch (error: any) {
    console.error('🔥 Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}