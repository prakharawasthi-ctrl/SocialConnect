
// /api/posts/[postId]/route.ts
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
// DELETE - Delete a Post (WITH ADMIN SUPPORT)
// ============================================
export const DELETE = withAuth(async (
  req: NextRequest & { user?: any },
  { params }: { params: Promise<{ postId: string }> }
) => {
  console.log("🗑️ DELETE /api/posts/[postId] - Request received");
  
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role; // ✅ Get user role from JWT
    const { postId } = await params;

    console.log("🔍 Delete request details:");
    console.log("  - User ID:", userId);
    console.log("  - User Role:", userRole);
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

    // Fetch the post to verify ownership
    console.log("📡 Fetching post from database...");
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("author_id, image_url")
      .eq("id", postId)
      .single();

    if (fetchError || !post) {
      console.error("❌ Post not found:", fetchError);
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    console.log("✅ Post found:", post);
    console.log("  - Post author:", post.author_id);
    console.log("  - Current user:", userId);
    console.log("  - Has image:", !!post.image_url);

    // ✅ CRITICAL: Check if user is owner OR admin
    const isOwner = post.author_id === userId;
    const isAdmin = userRole === 'admin';

    console.log("🔐 Authorization check:");
    console.log("  - Is owner:", isOwner);
    console.log("  - Is admin:", isAdmin);

    // ✅ Allow deletion if user is owner OR admin
    if (!isOwner && !isAdmin) {
      console.error("❌ Unauthorized: User is neither owner nor admin");
      return NextResponse.json(
        { error: "You do not have permission to delete this post" },
        { status: 403 }
      );
    }

    // ✅ Log admin action
    if (isAdmin && !isOwner) {
      console.log("🛡️ ADMIN ACTION: Admin deleting another user's post");
      console.log("  - Admin ID:", userId);
      console.log("  - Post owner ID:", post.author_id);
      
      // Optional: Log to audit table
      try {
        await supabase.from("admin_audit_log").insert({
          admin_id: userId,
          action: 'DELETE_POST',
          target_type: 'post',
          target_id: postId,
          details: { post_owner: post.author_id },
          created_at: new Date().toISOString()
        });
        console.log("✅ Admin action logged to audit table");
      } catch (auditError) {
        console.error("⚠️ Failed to log admin action:", auditError);
        // Continue with deletion even if audit fails
      }
    }

    console.log("✅ Authorization verified - proceeding with deletion");

    // Delete the image from storage if it exists
    if (post.image_url) {
      console.log("🖼️ Deleting image from storage...");
      const urlParts = post.image_url.split('/post-images/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        const { error: storageError } = await supabase.storage
          .from("post-images")
          .remove([filePath]);

        if (storageError) {
          console.error("⚠️ Failed to delete image:", storageError);
        } else {
          console.log("✅ Image deleted from storage");
        }
      }
    }

    // Delete associated likes
    console.log("🗑️ Deleting associated likes...");
    await supabase.from("likes").delete().eq("post_id", postId);

    // Delete associated comments
    console.log("🗑️ Deleting associated comments...");
    await supabase.from("comments").delete().eq("post_id", postId);

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

    return NextResponse.json({
      success: true,
      message: isAdmin && !isOwner 
        ? "Post deleted by admin" 
        : "Post deleted successfully",
      postId,
      deletedBy: isAdmin && !isOwner ? 'admin' : 'owner'
    }, { status: 200 });

  } catch (error) {
    console.error("🔥 SERVER ERROR in DELETE /api/posts/[postId]:", error);
    return NextResponse.json(
      { error: "Server failed to delete post" },
      { status: 500 }
    );
  }
});