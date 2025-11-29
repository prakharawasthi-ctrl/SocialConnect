import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { withAuth } from "@/lib/auth/middleware";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
// ============================================
// UPDATE - Update a Post
// ============================================ 
export const PUT = withAuth(async (
  req: NextRequest & { user?: any },
  { params }: { params: Promise<{ postId: string }> }
) => {
  console.log("✏️ PUT /api/posts/[postId] - Request received");
  
  try {
    const userId = req.user?.userId;
    const { postId } = await params;
    const { content } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No user ID" },
        { status: 401 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Verify post ownership
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single();

    if (fetchError || !post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author_id !== userId) {
      return NextResponse.json(
        { error: "You can only edit your own posts" },
        { status: 403 }
      );
    }

    // Update the post
    const { data: updatedPost, error: updateError } = await supabase
      .from("posts")
      .update({ 
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq("id", postId)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Failed to update post:", updateError);
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      );
    }

    console.log("✅ Post updated successfully");

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost
    });

  } catch (error) {
    console.error("🔥 SERVER ERROR in PUT /api/posts/[postId]:", error);
    return NextResponse.json(
      { error: "Server failed to update post" },
      { status: 500 }
    );
  }
});

// ============================================
// DELETE - Delete a Post
// ============================================
export const DELETE = withAuth(async (
  req: NextRequest & { user?: any },
  { params }: { params: Promise<{ postId: string }> }  // ✅ Changed to Promise
) => {
  console.log("🗑️ DELETE /api/posts/[postId] - Request received");
  console.log("📦 Request details:", {
    method: req.method,
    url: req.url,
    hasUser: !!req.user,
    userId: req.user?.userId
  });
  
  try {
    const userId = req.user?.userId;
    const { postId } = await params;  // ✅ Await params before destructuring

    console.log("🔍 Delete request details:");
    console.log("  - User ID:", userId);
    console.log("  - Post ID:", postId);

    if (!userId) {
      console.error("❌ No user ID found in request");
      return NextResponse.json(
        { error: "Unauthorized - No user ID" },
        { status: 401 }
      );
    }

    if (!postId) {
      console.error("❌ No post ID provided");
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // First, get the post to verify ownership and get image URL
    console.log("📡 Fetching post from database...");
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("author_id, image_url")
      .eq("id", postId)
      .single();

    if (fetchError) {
      console.error("❌ Error fetching post:", fetchError);
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    if (!post) {
      console.error("❌ Post not found in database");
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    console.log("✅ Post found:", post);
    console.log("  - Post author:", post.author_id);
    console.log("  - Current user:", userId);
    console.log("  - Has image:", !!post.image_url);

    // Verify ownership
    if (post.author_id !== userId) {
      console.error("❌ Unauthorized: User does not own this post");
      console.error("  - Post owner:", post.author_id);
      console.error("  - Requesting user:", userId);
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    console.log("✅ Ownership verified");

    // Delete the image from storage if it exists
    if (post.image_url) {
      console.log("🖼️ Deleting image from storage...");
      console.log("  - Image URL:", post.image_url);
      
      // Extract the file path from the URL
      const urlParts = post.image_url.split('/post-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        console.log("  - File path:", filePath);

        const { error: storageError } = await supabase.storage
          .from("post-images")
          .remove([filePath]);

        if (storageError) {
          console.error("⚠️ Failed to delete image:", storageError);
          // Continue anyway
        } else {
          console.log("✅ Image deleted from storage");
        }
      } else {
        console.log("⚠️ Could not extract file path from URL");
      }
    }

    // Delete associated likes
    console.log("🗑️ Deleting associated likes...");
    const { error: likesError } = await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId);

    if (likesError) {
      console.error("⚠️ Error deleting likes:", likesError);
    } else {
      console.log("✅ Likes deleted");
    }

    // Delete associated comments
    console.log("🗑️ Deleting associated comments...");
    const { error: commentsError } = await supabase
      .from("comments")
      .delete()
      .eq("post_id", postId);

    if (commentsError) {
      console.error("⚠️ Error deleting comments:", commentsError);
    } else {
      console.log("✅ Comments deleted");
    }

    // Finally, delete the post
    console.log("🗑️ Deleting post from database...");
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      console.error("❌ Failed to delete post:", deleteError);
      return NextResponse.json(
        { error: `Failed to delete post: ${deleteError.message}` },
        { status: 500 }
      );
    }

    console.log("✅✅✅ POST DELETED SUCCESSFULLY ✅✅✅");

    return NextResponse.json(
      { 
        success: true,
        message: "Post deleted successfully",
        postId 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("🔥 SERVER ERROR in DELETE /api/posts/[postId]:");
    console.error(error);
    return NextResponse.json(
      { error: "Server failed to delete post" },
      { status: 500 }
    );
  }
});