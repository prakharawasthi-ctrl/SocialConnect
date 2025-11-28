import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { withAuth } from "@/lib/auth/middleware";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET FOLLOWERS/FOLLOWING LIST
export const GET = withAuth(
  async (req: NextRequest & { user?: any }) => {
    try {
      const userId = req.user.id;
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type') || 'followers'; // 'followers' or 'following'
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      let query;

      if (type === 'followers') {
        // Get users who follow the authenticated user
        query = supabase
          .from('followers')
          .select(`
            id,
            created_at,
            follower:users!followers_follower_id_fkey(
              id,
              username,
              first_name,
              last_name,
              avatar_url,
              bio
            )
          `)
          .eq('following_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
      } else {
        // Get users that the authenticated user is following
        query = supabase
          .from('followers')
          .select(`
            id,
            created_at,
            following:users!followers_following_id_fkey(
              id,
              username,
              first_name,
              last_name,
              avatar_url,
              bio
            )
          `)
          .eq('follower_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Get followers error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch followers' },
          { status: 500 }
        );
      }

      // Transform the data to a cleaner format
      const transformedData = data.map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        user: type === 'followers' ? item.follower : item.following
      }));

      // Get total count
      const { count: totalCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq(type === 'followers' ? 'following_id' : 'follower_id', userId);

      return NextResponse.json({
        [type]: transformedData,
        total: totalCount || 0,
        limit,
        offset
      });
    } catch (err) {
      console.error('Get followers error:', err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

// FOLLOW USER
export const POST = withAuth(
  async (req: NextRequest & { user?: any }) => {
    try {
      const body = await req.json();
      const followingId = body.followingId;
      const followerId = req.user.id;

      if (!followingId) {
        return NextResponse.json(
          { error: "followingId is required" },
          { status: 400 }
        );
      }

      // Prevent self-follow
      if (followerId === followingId) {
        return NextResponse.json(
          { error: "Cannot follow yourself" },
          { status: 400 }
        );
      }

      // Check if already following
      const { data: exists } = await supabase
        .from("followers")
        .select("id")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .single();

      if (exists) {
        return NextResponse.json(
          { message: "Already following" },
          { status: 200 }
        );
      }

      // Create follow relationship
      const { error } = await supabase
        .from("followers")
        .insert({
          follower_id: followerId,
          following_id: followingId,
        });

      if (error) {
        console.error("Follow error:", error);
        return NextResponse.json(
          { error: "Failed to follow user" },
          { status: 500 }
        );
      }

      // Get updated counts
      const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', followerId);

      return NextResponse.json(
        { 
          message: "Followed successfully",
          following_count: followingCount || 0
        },
        { status: 201 }
      );
    } catch (err) {
      console.error("Follow error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

// UNFOLLOW USER
export const DELETE = withAuth(
  async (req: NextRequest & { user?: any }) => {
    try {
      const followerId = req.user.id;
      const { searchParams } = new URL(req.url);
      const followingId = searchParams.get('followingId');

      if (!followingId) {
        return NextResponse.json(
          { error: 'followingId is required' },
          { status: 400 }
        );
      }

      // Delete follow relationship
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) {
        console.error('Unfollow error:', error);
        return NextResponse.json(
          { error: 'Failed to unfollow user' },
          { status: 500 }
        );
      }

      // Get updated counts
      const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', followerId);

      return NextResponse.json({ 
        success: true,
        message: 'Unfollowed successfully',
        following_count: followingCount || 0
      });
    } catch (err) {
      console.error('Unfollow error:', err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);