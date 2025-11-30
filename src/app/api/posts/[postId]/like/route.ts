// // src/app/api/posts/[postId]/like/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
// import { withAuth } from '@/lib/auth/middleware';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // POST /api/posts/[postId]/like - Like a post
// export const POST = withAuth(async (
//   request: NextRequest & { user?: any },
//   context?: any
// ) => {
//   console.log('❤️ POST /api/posts/[postId]/like - Like request received');
  
//   try {
//     const params = context?.params;
//     if (!params) {
//       console.error('❌ No params found in context');
//       return NextResponse.json(
//         { error: 'Invalid request' },
//         { status: 400 }
//       );
//     }

//     const { postId } = await params;
//     const userId = request.user?.userId;

//     console.log('📝 Like details:');
//     console.log('  - Post ID:', postId);
//     console.log('  - User ID:', userId);

//     if (!userId) {
//       console.error('❌ No user ID found');
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Check if post exists
//     console.log('📡 Checking if post exists...');
//     const { data: post } = await supabase
//       .from('posts')
//       .select('id')
//       .eq('id', postId)
//       .single();

//     if (!post) {
//       console.error('❌ Post not found');
//       return NextResponse.json(
//         { error: 'Post not found' },
//         { status: 404 }
//       );
//     }

//     console.log('✅ Post exists');

//     // Check if already liked
//     console.log('📡 Checking if already liked...');
//     const { data: existingLike } = await supabase
//       .from('likes')
//       .select('id')
//       .eq('post_id', postId)
//       .eq('user_id', userId)
//       .single();

//     if (existingLike) {
//       console.log('⚠️ Post already liked by user');
//       return NextResponse.json(
//         { error: 'Post already liked' },
//         { status: 400 }
//       );
//     }

//     // Create like
//     console.log('💖 Creating like...');
//     const { data, error } = await supabase
//       .from('likes')
//       .insert({
//         post_id: postId,
//         user_id: userId
//       })
//       .select()
//       .single();

//     if (error) {
//       console.error('❌ Error creating like:', error);
//       throw error;
//     }

//     console.log('✅ Like created successfully');

//     // Get updated likes count
//     console.log('📊 Fetching updated likes count...');
//     const { count: likesCount } = await supabase
//       .from('likes')
//       .select('*', { count: 'exact', head: true })
//       .eq('post_id', postId);

//     console.log('✅ Likes count:', likesCount);

//     return NextResponse.json({
//       success: true,
//       data,
//       likes_count: likesCount || 0
//     });
//   } catch (error: any) {
//     console.error('🔥 Like post error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to like post' },
//       { status: 500 }
//     );
//   }
// });

// // DELETE /api/posts/[postId]/like - Unlike a post
// export const DELETE = withAuth(async (
//   request: NextRequest & { user?: any },
//   context?: any
// ) => {
//   console.log('💔 DELETE /api/posts/[postId]/like - Unlike request received');
  
//   try {
//     const params = context?.params;
//     if (!params) {
//       console.error('❌ No params found in context');
//       return NextResponse.json(
//         { error: 'Invalid request' },
//         { status: 400 }
//       );
//     }

//     const { postId } = await params;
//     const userId = request.user?.userId;

//     console.log('📝 Unlike details:');
//     console.log('  - Post ID:', postId);
//     console.log('  - User ID:', userId);

//     if (!userId) {
//       console.error('❌ No user ID found');
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 401 }
//       );
//     }

//     // Delete like
//     console.log('🗑️ Removing like...');
//     const { error } = await supabase
//       .from('likes')
//       .delete()
//       .eq('post_id', postId)
//       .eq('user_id', userId);

//     if (error) {
//       console.error('❌ Error removing like:', error);
//       throw error;
//     }

//     console.log('✅ Like removed successfully');

//     // Get updated likes count
//     console.log('📊 Fetching updated likes count...');
//     const { count: likesCount } = await supabase
//       .from('likes')
//       .select('*', { count: 'exact', head: true })
//       .eq('post_id', postId);

//     console.log('✅ Likes count:', likesCount);

//     return NextResponse.json({
//       success: true,
//       likes_count: likesCount || 0
//     });
//   } catch (error: any) {
//     console.error('🔥 Unlike post error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to unlike post' },
//       { status: 500 }
//     );
//   }
// });
// src/app/api/posts/[postId]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '@/lib/auth/middleware';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/posts/[postId]/like - Like a post
export const POST = withAuth(async (
  request: NextRequest & { user?: any },
  { params }: { params: Promise<{ postId: string }> }
) => {
  console.log('❤️ POST /api/posts/[postId]/like - Like request received');
  
  try {
    // Await params to get postId
    const { postId } = await params;
    const userId = request.user?.userId;

    console.log('📝 Like details:');
    console.log('  - Post ID:', postId);
    console.log('  - User ID:', userId);

    if (!userId) {
      console.error('❌ No user ID found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if post exists
    console.log('📡 Checking if post exists...');
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (!post) {
      console.error('❌ Post not found');
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    console.log('✅ Post exists');

    // Check if already liked
    console.log('📡 Checking if already liked...');
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      console.log('⚠️ Post already liked by user');
      return NextResponse.json(
        { error: 'Post already liked' },
        { status: 400 }
      );
    }

    // Create like
    console.log('💖 Creating like...');
    const { data, error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating like:', error);
      throw error;
    }

    console.log('✅ Like created successfully');

    // Get updated likes count
    console.log('📊 Fetching updated likes count...');
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    console.log('✅ Likes count:', likesCount);

    return NextResponse.json({
      success: true,
      data,
      likes_count: likesCount || 0
    });
  } catch (error: any) {
    console.error('🔥 Like post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to like post' },
      { status: 500 }
    );
  }
});

// DELETE /api/posts/[postId]/like - Unlike a post
export const DELETE = withAuth(async (
  request: NextRequest & { user?: any },
  { params }: { params: Promise<{ postId: string }> }
) => {
  console.log('💔 DELETE /api/posts/[postId]/like - Unlike request received');
  
  try {
    // Await params to get postId
    const { postId } = await params;
    const userId = request.user?.userId;

    console.log('📝 Unlike details:');
    console.log('  - Post ID:', postId);
    console.log('  - User ID:', userId);

    if (!userId) {
      console.error('❌ No user ID found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete like
    console.log('🗑️ Removing like...');
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error removing like:', error);
      throw error;
    }

    console.log('✅ Like removed successfully');

    // Get updated likes count
    console.log('📊 Fetching updated likes count...');
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    console.log('✅ Likes count:', likesCount);

    return NextResponse.json({
      success: true,
      likes_count: likesCount || 0
    });
  } catch (error: any) {
    console.error('🔥 Unlike post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unlike post' },
      { status: 500 }
    );
  }
});