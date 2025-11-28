import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { withAuth } from "@/lib/auth/middleware";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const DELETE = withAuth(
  async (
    req: NextRequest & { user?: any }, 
    { params }: { params: { postId: string } }
  ) => {
    const postId = params.postId;
    const user = req.user;

    const { data: post } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.author_id !== user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await supabase.from("posts").delete().eq("id", postId);

    return NextResponse.json({ message: "Post deleted successfully" });
  }
);
