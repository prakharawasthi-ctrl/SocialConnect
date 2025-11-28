// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import { withAuth } from "@/lib/auth/middleware";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export const DELETE = withAuth(
//   async (
//     req: NextRequest & { user?: any }, 
//     { params }: { params: { postId: string } }
//   ) => {
//     const postId = params.postId;
//     const user = req.user;

//     const { data: post } = await supabase
//       .from("posts")
//       .select("author_id")
//       .eq("id", postId)
//       .single();

//     if (!post) {
//       return NextResponse.json({ error: "Post not found" }, { status: 404 });
//     }

//     if (post.author_id !== user.userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     await supabase.from("posts").delete().eq("id", postId);

//     return NextResponse.json({ message: "Post deleted successfully" });
//   }
// );


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
    try {
      const postId = params.postId;
      const userId = req.user.userId; // ✅ FIXED

      if (!postId) {
        return NextResponse.json(
          { error: "Post ID is required" },
          { status: 400 }
        );
      }

      // Fetch post
      const { data: post, error: postError } = await supabase
        .from("posts")
        .select("author_id")
        .eq("id", postId)
        .single();

      if (postError || !post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }

      // Ensure correct user
      if (post.author_id !== userId) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Delete the post
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        return NextResponse.json(
          { error: "Failed to delete post" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "Post deleted successfully",
      });
    } catch (err) {
      console.error("Delete post error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
