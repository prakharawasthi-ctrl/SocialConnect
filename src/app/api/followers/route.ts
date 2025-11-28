
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { withAuth } from "@/lib/auth/middleware";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET FOLLOWERS / FOLLOWING LIST
export const GET = withAuth(async (req: NextRequest & { user?: any }) => {
  try {
    const userId = req.user.userId;
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type") || "followers"; 
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query;

    if (type === "followers") {
      query = supabase
        .from("follows") // ✅ FIXED
        .select(
          `
            id,
            created_at,
            follower:users!follows_follower_id_fkey(
              id,
              username,
              first_name,
              last_name,
              avatar_url,
              bio
            )
          `
        )
        .eq("following_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
    } else {
      query = supabase
        .from("follows") // ✅ FIXED
        .select(
          `
            id,
            created_at,
            following:users!follows_following_id_fkey(
              id,
              username,
              first_name,
              last_name,
              avatar_url,
              bio
            )
          `
        )
        .eq("follower_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get followers error:", error);
      return NextResponse.json(
        { error: "Failed to fetch followers" },
        { status: 500 }
      );
    }

    const transformedData = data.map((item: any) => ({
      id: item.id,
      created_at: item.created_at,
      user: type === "followers" ? item.follower : item.following,
    }));

    const { count: totalCount } = await supabase
      .from("follows") // ✅ FIXED
      .select("*", { count: "exact", head: true })
      .eq(type === "followers" ? "following_id" : "follower_id", userId);

    return NextResponse.json({
      [type]: transformedData,
      total: totalCount || 0,
      limit,
      offset,
    });
  } catch (err) {
    console.error("Get followers error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// FOLLOW USER
export const POST = withAuth(async (req: NextRequest & { user?: any }) => {
  try {
    const body = await req.json();
    const followingId = body.followingId;
    const followerId = req.user.userId;

    if (!followingId) {
      return NextResponse.json({ error: "followingId is required" }, { status: 400 });
    }

    if (followerId === followingId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const { data: exists } = await supabase
      .from("follows") // ✅ FIXED
      .select("id")
      .eq("follower_id", followerId)
      .eq("following_id", followingId)
      .single();

    if (exists)
      return NextResponse.json({ message: "Already following" }, { status: 200 });

    const { error } = await supabase
      .from("follows") // ✅ FIXED
      .insert({ follower_id: followerId, following_id: followingId });

    if (error) {
      console.error("Follow error:", error);
      return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Followed successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Follow error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});

// UNFOLLOW USER
export const DELETE = withAuth(async (req: NextRequest & { user?: any }) => {
  try {
    const followerId = req.user.userId;
    const { searchParams } = new URL(req.url);
    const followingId = searchParams.get("followingId");

    if (!followingId) {
      return NextResponse.json({ error: "followingId is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("follows") // ✅ FIXED
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", followingId);

    if (error) {
      console.error("Unfollow error:", error);
      return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Unfollowed successfully",
    });
  } catch (err) {
    console.error("Unfollow error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
