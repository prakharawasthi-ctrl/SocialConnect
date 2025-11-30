

// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { withAuth } from "@/lib/auth/middleware";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================
// GET - Fetch Posts
// ============================================
export const GET = withAuth(async (req: NextRequest & { user?: any }) => {
  console.log("📩 GET /api/posts - Fetching posts");
  
  try {
    const userId = req.user.userId;
    const { searchParams } = new URL(req.url);
    const feedType = searchParams.get('feedType') || 'all';

    console.log("👤 User ID:", userId);
    console.log("📋 Feed Type:", feedType);

    // Fetch posts with user data
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        id,
        content,
        image_url,
        created_at,
        author_id,
        user:users!posts_author_id_fkey (
          id,
          username,
          first_name,
          last_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ Error fetching posts:", error);
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    console.log("✅ Fetched", posts.length, "posts from database");
    console.log("🖼️ Posts with images:", posts.filter(p => p.image_url).length);

    // Get likes for current user
    const { data: likes } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", userId);

    const likedPostIds = new Set(likes?.map(l => l.post_id) || []);

    // Get following list
    const { data: followingData } = await supabase
      .from("followers")
      .select("following_id")
      .eq("follower_id", userId);

    const followingIds = new Set(followingData?.map(f => f.following_id) || []);

    // Get likes and comments counts for each post
    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const [likesResult, commentsResult] = await Promise.all([
          supabase
            .from("likes")
            .select("id", { count: 'exact', head: true })
            .eq("post_id", post.id),
          supabase
            .from("comments")
            .select("id", { count: 'exact', head: true })
            .eq("post_id", post.id)
        ]);

        const enrichedPost = {
          ...post,
          likes_count: likesResult.count || 0,
          comments_count: commentsResult.count || 0,
          is_liked_by_current_user: likedPostIds.has(post.id),
          is_following: followingIds.has(post.author_id) || post.author_id === userId
        };

        // Log posts with images
        if (post.image_url) {
          console.log("🖼️ Post with image:", {
            id: post.id,
            imageUrl: post.image_url
          });
        }

        return enrichedPost;
      })
    );

    console.log("✅ Returning", postsWithCounts.length, "enriched posts");

    return NextResponse.json({ posts: postsWithCounts }, { status: 200 });

  } catch (error) {
    console.error("🔥 SERVER ERROR in GET /api/posts:", error);
    return NextResponse.json(
      { error: "Server failed to fetch posts" },
      { status: 500 }
    );
  }
});

// ============================================
// POST - Create New Post
// ============================================
export const POST = withAuth(async (req: NextRequest & { user?: any }) => {
  console.log("📩 POST /api/posts - Creating new post");

  try {
    const body = await req.json();
    console.log("📦 Received body keys:", Object.keys(body));
    console.log("📦 Has image_url?", !!body.image_url);

    const { content, image_url } = body;
    const userId = req.user.userId;

    console.log("👤 Current user:", userId);

    if (!content && !image_url) {
      console.log("❌ No content or image provided");
      return NextResponse.json(
        { error: "Post cannot be empty" },
        { status: 400 }
      );
    }

    let finalImageUrl = null;

    //
    // Upload Image to Supabase Storage
    //
    if (image_url) {
      console.log("🖼 Base64 image received, starting upload...");

      // Validate base64 format
      if (!image_url.startsWith("data:")) {
        console.log("❌ Invalid image format");
        return NextResponse.json(
          { error: "Invalid image format - must be base64" },
          { status: 400 }
        );
      }

      // Extract MIME type
      const mimeMatch = image_url.match(/^data:(.+);base64,/);
      if (!mimeMatch) {
        console.error("❌ Unable to extract MIME type");
        return NextResponse.json(
          { error: "Invalid image format - cannot extract MIME type" },
          { status: 400 }
        );
      }

      const mimeType = mimeMatch[1];
      const ext = mimeType.split("/")[1];

      console.log("🧪 MIME Type:", mimeType);
      console.log("🧪 File extension:", ext);

      // Extract base64 data
      const base64Data = image_url.split(";base64,").pop();
      if (!base64Data) {
        console.log("❌ No base64 data found");
        return NextResponse.json(
          { error: "Invalid base64 image - no data" },
          { status: 400 }
        );
      }

      // Convert to buffer
      const buffer = Buffer.from(base64Data, "base64");
      console.log("📦 Buffer size:", buffer.length, "bytes");

      // Generate filename
      const timestamp = Date.now();
      const fileName = `user_${userId}_${timestamp}.${ext}`;
      const filePath = `public/${fileName}`;
      
      console.log("📁 Uploading to:", filePath);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: false,
        });

      if (uploadError) {
        console.error("❌ Upload failed:", uploadError);
        return NextResponse.json(
          { error: `Image upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }

      console.log("✅ Upload success:", uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      finalImageUrl = urlData.publicUrl;

      console.log("🌍 Public URL:", finalImageUrl);

      if (!finalImageUrl) {
        console.error("❌ Failed to generate public URL");
        return NextResponse.json(
          { error: "Failed to generate image URL" },
          { status: 500 }
        );
      }
    }

    //
    // Insert Post Into Database
    //
    console.log("📝 Inserting post into database...");

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        author_id: userId,
        content,
        image_url: finalImageUrl,
      })
      .select("id, content, image_url, created_at, author_id")
      .single();

    if (postError) {
      console.error("❌ Database insert error:", postError);
      return NextResponse.json(
        { error: `Failed to save post: ${postError.message}` },
        { status: 500 }
      );
    }

    console.log("✅ Post saved:", post);
    console.log("✅ Image URL in DB:", post.image_url);

    //
    // Fetch User Profile
    //
    const { data: user } = await supabase
      .from("users")
      .select("id, username, first_name, last_name, avatar_url")
      .eq("id", userId)
      .single();

    console.log("👤 User loaded:", user);

    //
    // Return Response
    //
    const fullPost = {
      ...post,
      user,
      likes_count: 0,
      comments_count: 0,
      is_liked_by_current_user: false,
      is_following: false,
    };

    console.log("📤 Sending response");

    return NextResponse.json({ post: fullPost }, { status: 201 });

  } catch (error) {
    console.error("🔥 SERVER ERROR in POST /api/posts:", error);
    return NextResponse.json(
      { error: "Server failed to create post" },
      { status: 500 }
    );
  }
});