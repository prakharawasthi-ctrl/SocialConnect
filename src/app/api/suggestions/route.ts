import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = auth.replace("Bearer ", "");

    // Decode your custom JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch following list
    const { data: following } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);

    const followingIds = following?.map(f => f.following_id) || [];

    // Fetch all users
    const { data: allUsers } = await supabase
      .from("users")
      .select("id, username, first_name, last_name, avatar_url");

    // FIX: handle null safely 👇
    const usersList = allUsers || [];

    // Filter suggestions
    const suggestions = usersList.filter(
      u => u.id !== userId && !followingIds.includes(u.id)
    );

    return NextResponse.json({
      users: suggestions.slice(0, 5),
    });

  } catch (err: any) {
    console.error("SUGGESTIONS ERROR:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
