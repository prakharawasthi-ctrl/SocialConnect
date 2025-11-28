// app/api/posts/[postId]/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// POST /api/posts/[postId]/like - Like a post
export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const postId = params.postId;

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

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', decoded.userId)
      .single();

    if (existingLike) {
      return NextResponse.json(
        { error: 'Post already liked' },
        { status: 400 }
      );
    }

    // Create like
    const { data, error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: decoded.userId
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Get updated likes count
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({
      success: true,
      data,
      likes_count: likesCount || 0
    });
  } catch (error: any) {
    console.error('Like post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to like post' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[postId]/like - Unlike a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const postId = params.postId;

    // Delete like
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', decoded.userId);

    if (error) {
      throw error;
    }

    // Get updated likes count
    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({
      success: true,
      likes_count: likesCount || 0
    });
  } catch (error: any) {
    console.error('Unlike post error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unlike post' },
      { status: 500 }
    );
  }
}