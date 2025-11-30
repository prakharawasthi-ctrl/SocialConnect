// // app/api/posts/[postId]/comments/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
// import { withAuth } from '@/lib/auth/middleware';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // GET /api/posts/[postId]/comments - Get all comments for a post
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ postId: string }> }
// ) {
//   try {
//     const { postId } = await params;

//     const { data: comments, error } = await supabase
//       .from('comments')
//       .select(`
//         *,
//         user:users!comments_user_id_fkey (
//           id,
//           username,
//           first_name,
//           last_name,
//           avatar_url
//         )
//       `)
//       .eq('post_id', postId)
//       .order('created_at', { ascending: true });

//     if (error) {
//       throw error;
//     }

//     return NextResponse.json({
//       success: true,
//       data: comments || []
//     });
//   } catch (error: any) {
//     console.error('Get comments error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch comments' },
//       { status: 500 }
//     );
//   }
// }

// // POST /api/posts/[postId]/comments - Add a comment
// export const POST = withAuth(async (
//   request: NextRequest & { user?: any },
//   context?: any
// ) => {
//   try {
//     const params = context?.params;
//     if (!params) {
//       return NextResponse.json(
//         { error: 'Invalid request' },
//         { status: 400 }
//       );
//     }

//     const { postId } = await params;
//     const userId = request.user?.userId;
//     const { content } = await request.json();

//     if (!content || !content.trim()) {
//       return NextResponse.json(
//         { error: 'Comment content is required' },
//         { status: 400 }
//       );
//     }

//     // Check if post exists
//     const { data: post } = await supabase
//       .from('posts')
//       .select('id')
//       .eq('id', postId)
//       .single();

//     if (!post) {
//       return NextResponse.json(
//         { error: 'Post not found' },
//         { status: 404 }
//       );
//     }

//     // Create comment
//     const { data: comment, error } = await supabase
//       .from('comments')
//       .insert({
//         post_id: postId,
//         user_id: userId,
//         content: content.trim()
//       })
//       .select(`
//         *,
//         user:users!comments_user_id_fkey (
//           id,
//           username,
//           first_name,
//           last_name,
//           avatar_url
//         )
//       `)
//       .single();

//     if (error) {
//       throw error;
//     }

//     // Get updated comments count
//     const { count: commentsCount } = await supabase
//       .from('comments')
//       .select('*', { count: 'exact', head: true })
//       .eq('post_id', postId);

//     return NextResponse.json({
//       success: true,
//       data: comment,
//       comments_count: commentsCount || 0
//     });
//   } catch (error: any) {
//     console.error('Add comment error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to add comment' },
//       { status: 500 }
//     );
//   }
// });

// // DELETE /api/posts/[postId]/comments/[commentId] - Delete a comment
// // Note: This would need a separate route file for [commentId]
// app/api/posts/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withAuth } from '@/lib/auth/middleware';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/posts/[postId]/comments - Get all comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users!comments_user_id_fkey (
          id,
          username,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: comments || []
    });
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/posts/[postId]/comments - Add a comment
export const POST = withAuth(async (
  request: NextRequest & { user?: any },
  { params }: { params: Promise<{ postId: string }> }
) => {
  try {
    const { postId } = await params;
    const userId = request.user?.userId;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Check if post exists
    const { data: post } = await supabase
      .from('posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Create comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        content: content.trim()
      })
      .select(`
        *,
        user:users!comments_user_id_fkey (
          id,
          username,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    // Get updated comments count
    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({
      success: true,
      data: comment,
      comments_count: commentsCount || 0
    });
  } catch (error: any) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add comment' },
      { status: 500 }
    );
  }
});