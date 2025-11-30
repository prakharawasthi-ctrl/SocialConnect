// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// export async function DELETE(
//   request: NextRequest,
//   context: { params: { userId: string } }
// ) {
//   try {
//     const { params } = context;
//     const { userId } = params;

//     console.log('========================================');
//     console.log('🗑️  Delete user request received');
    
//     const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//     const supabaseKey =
//       process.env.SUPABASE_SERVICE_ROLE_KEY ||
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

//     if (!supabaseUrl || !supabaseKey) {
//       console.error('❌ Missing Supabase environment variables');
//       return NextResponse.json(
//         { error: 'Server configuration error' },
//         { status: 500 }
//       );
//     }

//     const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

//     const authHeader = request.headers.get('authorization');
//     const token = authHeader?.replace('Bearer ', '');

//     if (!token) {
//       return NextResponse.json(
//         { error: 'No authorization token' },
//         { status: 401 }
//       );
//     }

//     const {
//       data: { user },
//       error: authError
//     } = await supabaseAdmin.auth.getUser(token);

//     if (authError || !user) {
//       console.error('❌ Auth error:', authError?.message || 'No user found');
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     const { data: currentUser, error: userError } = await supabaseAdmin
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

//     console.log('📝 Deleting user ID:', userId);

//     if (!userId) {
//       return NextResponse.json(
//         { error: 'User ID is required' },
//         { status: 400 }
//       );
//     }

//     if (userId === user.id) {
//       return NextResponse.json(
//         { error: 'Cannot delete your own account' },
//         { status: 400 }
//       );
//     }

//     const { data: userToDelete, error: fetchError } = await supabaseAdmin
//       .from('users')
//       .select('id, username, email')
//       .eq('id', userId)
//       .single();

//     if (fetchError || !userToDelete) {
//       console.error('❌ User not found:', fetchError?.message);
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     console.log('👤 Deleting user:', userToDelete.username);

//     const { error: deleteError } = await supabaseAdmin
//       .from('users')
//       .delete()
//       .eq('id', userId);

//     if (deleteError) {
//       console.error('❌ Database delete error:', deleteError.message);
//       return NextResponse.json(
//         { error: 'Failed to delete user: ' + deleteError.message },
//         { status: 500 }
//       );
//     }

//     try {
//       const { error: authDeleteError } =
//         await supabaseAdmin.auth.admin.deleteUser(userId);

//       if (authDeleteError) {
//         console.error('⚠️  Failed to delete auth user:', authDeleteError.message);
//       } else {
//         console.log('✅ Auth user deleted');
//       }
//     } catch (authDeleteError: any) {
//       console.error('⚠️  Failed to delete auth user:', authDeleteError?.message);
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
//       {
//         error: 'Internal server error: ' + (error?.message || 'Unknown error')
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params Promise
    const { userId } = await params;

    console.log('========================================');
    console.log('🗑️  Delete user request received');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token' },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: authError
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      console.error('❌ Auth error:', authError?.message || 'No user found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    console.log('📝 Deleting user ID:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (userId === user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    const { data: userToDelete, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, username, email')
      .eq('id', userId)
      .single();

    if (fetchError || !userToDelete) {
      console.error('❌ User not found:', fetchError?.message);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('👤 Deleting user:', userToDelete.username);

    const { error: deleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('❌ Database delete error:', deleteError.message);
      return NextResponse.json(
        { error: 'Failed to delete user: ' + deleteError.message },
        { status: 500 }
      );
    }

    try {
      const { error: authDeleteError } =
        await supabaseAdmin.auth.admin.deleteUser(userId);

      if (authDeleteError) {
        console.error('⚠️  Failed to delete auth user:', authDeleteError.message);
      } else {
        console.log('✅ Auth user deleted');
      }
    } catch (authDeleteError: any) {
      console.error('⚠️  Failed to delete auth user:', authDeleteError?.message);
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
      {
        error: 'Internal server error: ' + (error?.message || 'Unknown error')
      },
      { status: 500 }
    );
  }
}