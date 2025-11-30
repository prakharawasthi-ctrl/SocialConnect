// // CREATE THIS FILE: src/app/api/users/[userId]/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/superbase/client';
// import { withAuth } from '@/lib/auth/middleware';

// async function handler(req: NextRequest, { params }: { params: { userId: string } }) {
//   try {
//     console.log('========================================');
//     console.log('🔄 Get user profile request received');
    
//     const { userId } = params;
//     console.log('📝 Fetching user ID:', userId);

//     if (!userId) {
//       return NextResponse.json(
//         { error: 'User ID is required' },
//         { status: 400 }
//       );
//     }

//     // Fetch user profile from Supabase
//     const { data, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('id', userId)
//       .single();

//     if (error) {
//       console.error('❌ Database fetch error:', error);
//       return NextResponse.json(
//         { error: 'Failed to fetch user profile: ' + error.message },
//         { status: 500 }
//       );
//     }

//     if (!data) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     console.log('✅ User profile fetched successfully');
//     console.log('  - Has bio:', !!data.bio);
//     console.log('  - Has avatar:', !!data.avatar_url);
//     console.log('========================================');

//     return NextResponse.json({
//       success: true,
//       user: data
//     });

//   } catch (error: any) {
//     console.error('🔥 Unexpected error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error: ' + error.message },
//       { status: 500 }
//     );
//   }
// }

// // Wrap handler with authentication middleware
// export const GET = withAuth(handler);

// // CREATE THIS FILE: src/app/api/admin/users/[userId]/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/superbase/client';
// import { withAuth } from '@/lib/auth/middleware';

// async function handler(req: NextRequest, { params }: { params: { userId: string } }) {
//   try {
//     console.log('========================================');
//     console.log('🗑️  Delete user request received');
    
//     // Get the authenticated user from the request
//     const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
//     if (!token) {
//       return NextResponse.json(
//         { error: 'No authorization token' },
//         { status: 401 }
//       );
//     }

//     // Verify token and get current user
//     const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
//     if (authError || !user) {
//       console.error('❌ Auth error:', authError);
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Check if user is admin
//     const { data: currentUser, error: userError } = await supabase
//       .from('users')
//       .select('role')
//       .eq('id', user.id)
//       .single();

//     if (userError || !currentUser || currentUser.role !== 'admin') {
//       console.error('❌ User is not admin');
//       return NextResponse.json(
//         { error: 'Forbidden: Admin access required' },
//         { status: 403 }
//       );
//     }

//     const { userId } = params;
//     console.log('📝 Deleting user ID:', userId);

//     if (!userId) {
//       return NextResponse.json(
//         { error: 'User ID is required' },
//         { status: 400 }
//       );
//     }

//     // Prevent admin from deleting themselves
//     if (userId === user.id) {
//       return NextResponse.json(
//         { error: 'Cannot delete your own account' },
//         { status: 400 }
//       );
//     }

//     // Check if user exists
//     const { data: userToDelete, error: fetchError } = await supabase
//       .from('users')
//       .select('id, username, email')
//       .eq('id', userId)
//       .single();

//     if (fetchError || !userToDelete) {
//       console.error('❌ User not found:', fetchError);
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     console.log('👤 Deleting user:', userToDelete.username);

//     // Delete user from database (cascade will handle related records)
//     const { error: deleteError } = await supabase
//       .from('users')
//       .delete()
//       .eq('id', userId);

//     if (deleteError) {
//       console.error('❌ Database delete error:', deleteError);
//       return NextResponse.json(
//         { error: 'Failed to delete user: ' + deleteError.message },
//         { status: 500 }
//       );
//     }

//     // Also delete from Supabase Auth (optional, but recommended)
//     try {
//       // Note: This requires service role key, so you might need to handle this differently
//       // For now, we'll just delete from the users table
//       console.log('⚠️  Auth user deletion skipped (requires service role)');
//     } catch (authDeleteError) {
//       console.error('⚠️  Failed to delete auth user:', authDeleteError);
//       // Continue anyway since database user is deleted
//     }

//     console.log('✅ User deleted successfully');
//     console.log('========================================');

//     return NextResponse.json({
//       success: true,
//       message: 'User deleted successfully',
//       deletedUser: {
//         id: userToDelete.id,
//         username: userToDelete.username,
//         email: userToDelete.email
//       }
//     });

//   } catch (error: any) {
//     console.error('🔥 Unexpected error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error: ' + error.message },
//       { status: 500 }
//     );
//   }
// }

// // Wrap handler with authentication middleware
// export const DELETE = withAuth(handler);


// CREATE THIS FILE: src/app/api/admin/users/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    console.log('========================================');
    console.log('🗑️  Delete user request received');
    
    // Get the authenticated user from the request
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token' },
        { status: 401 }
      );
    }

    // Verify token and get current user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !currentUser || currentUser.role !== 'admin') {
      console.error('❌ User is not admin');
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { userId } = params;
    console.log('📝 Deleting user ID:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: userToDelete, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, username, email')
      .eq('id', userId)
      .single();

    if (fetchError || !userToDelete) {
      console.error('❌ User not found:', fetchError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('👤 Deleting user:', userToDelete.username);

    // Delete user from database (cascade will handle related records)
    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('❌ Database delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete user: ' + deleteError.message },
        { status: 500 }
      );
    }

    // Also delete from Supabase Auth
    try {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (authDeleteError) {
        console.error('⚠️  Failed to delete auth user:', authDeleteError);
      } else {
        console.log('✅ Auth user deleted');
      }
    } catch (authDeleteError) {
      console.error('⚠️  Failed to delete auth user:', authDeleteError);
      // Continue anyway since database user is deleted
    }

    console.log('✅ User deleted successfully');
    console.log('========================================');

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: {
        id: userToDelete.id,
        username: userToDelete.username,
        email: userToDelete.email
      }
    });

  } catch (error: any) {
    console.error('🔥 Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

// No need for withAuth wrapper - we handle auth manually
// export const DELETE = withAuth(handler);