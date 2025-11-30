// // src/app/api/users/avatar/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import { withAuth } from "@/lib/auth/middleware";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// export const POST = withAuth(async (req: NextRequest & { user?: any }) => {
//   console.log("📩 POST /api/users/avatar - Uploading avatar");

//   try {
//     const body = await req.json();
//     const { image } = body;
//     const userId = req.user.userId;

//     console.log("👤 User ID:", userId);

//     if (!image) {
//       return NextResponse.json(
//         { error: "No image provided" },
//         { status: 400 }
//       );
//     }

//     // Validate base64 format
//     if (!image.startsWith("data:")) {
//       return NextResponse.json(
//         { error: "Invalid image format - must be base64" },
//         { status: 400 }
//       );
//     }

//     // Extract MIME type
//     const mimeMatch = image.match(/^data:(.+);base64,/);
//     if (!mimeMatch) {
//       console.error("❌ Unable to extract MIME type");
//       return NextResponse.json(
//         { error: "Invalid image format - cannot extract MIME type" },
//         { status: 400 }
//       );
//     }

//     const mimeType = mimeMatch[1];
//     const ext = mimeType.split("/")[1];

//     console.log("🧪 MIME Type:", mimeType);
//     console.log("🧪 File extension:", ext);

//     // Extract base64 data
//     const base64Data = image.split(";base64,").pop();
//     if (!base64Data) {
//       return NextResponse.json(
//         { error: "Invalid base64 image - no data" },
//         { status: 400 }
//       );
//     }

//     // Convert to buffer
//     const buffer = Buffer.from(base64Data, "base64");
//     console.log("📦 Buffer size:", buffer.length, "bytes");

//     // Generate filename
//     const timestamp = Date.now();
//     const fileName = `user_${userId}_${timestamp}.${ext}`;
//     const filePath = `public/${fileName}`;
    
//     console.log("📁 Uploading to avatars bucket:", filePath);

//     // Delete old avatar if exists
//     const { data: userData } = await supabase
//       .from("users")
//       .select("avatar_url")
//       .eq("id", userId)
//       .single();

//     if (userData?.avatar_url && userData.avatar_url.includes('supabase')) {
//       const oldFilePath = userData.avatar_url.split('/avatars/').pop();
//       if (oldFilePath) {
//         console.log("🗑️ Deleting old avatar:", oldFilePath);
//         await supabase.storage
//           .from("avatars")
//           .remove([oldFilePath]);
//       }
//     }

//     // Upload to Supabase Storage (avatars bucket)
//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from("avatars")
//       .upload(filePath, buffer, {
//         contentType: mimeType,
//         upsert: false,
//       });

//     if (uploadError) {
//       console.error("❌ Upload failed:", uploadError);
//       return NextResponse.json(
//         { error: `Image upload failed: ${uploadError.message}` },
//         { status: 500 }
//       );
//     }

//     console.log("✅ Upload success:", uploadData);

//     // Get public URL
//     const { data: urlData } = supabase.storage
//       .from("avatars")
//       .getPublicUrl(filePath);

//     const avatarUrl = urlData.publicUrl;

//     console.log("🌍 Public URL:", avatarUrl);

//     if (!avatarUrl) {
//       console.error("❌ Failed to generate public URL");
//       return NextResponse.json(
//         { error: "Failed to generate image URL" },
//         { status: 500 }
//       );
//     }

//     // Update user's avatar_url in database
//     const { data: updatedUser, error: updateError } = await supabase
//       .from("users")
//       .update({ avatar_url: avatarUrl })
//       .eq("id", userId)
//       .select("id, username, first_name, last_name, avatar_url, bio, role, created_at, followers_count, following_count, posts_count")
//       .single();

//     if (updateError) {
//       console.error("❌ Failed to update user avatar:", updateError);
//       return NextResponse.json(
//         { error: "Failed to update avatar in database" },
//         { status: 500 }
//       );
//     }

//     console.log("✅ Avatar updated successfully");

//     return NextResponse.json({ 
//       avatar_url: avatarUrl,
//       user: updatedUser 
//     }, { status: 200 });

//   } catch (error) {
//     console.error("🔥 SERVER ERROR in POST /api/users/avatar:", error);
//     return NextResponse.json(
//       { error: "Server failed to upload avatar" },
//       { status: 500 }
//     );
//   }
// });
// src/app/api/users/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { withAuth } from "@/lib/auth/middleware";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const POST = withAuth(async (req: NextRequest & { user?: any }) => {
  console.log("📩 POST /api/users/avatar - Uploading avatar");

  try {
    const body = await req.json();
    const { image } = body;
    const userId = req.user.userId;

    console.log("👤 User ID:", userId);

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!image.startsWith("data:")) {
      return NextResponse.json(
        { error: "Invalid image format - must be base64" },
        { status: 400 }
      );
    }

    // Extract MIME type
    const mimeMatch = image.match(/^data:(.+);base64,/);
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
    const base64Data = image.split(";base64,").pop();
    if (!base64Data) {
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
    
    console.log("📁 Uploading to avatars bucket:", filePath);

    // Delete old avatar if exists
    const { data: userData } = await supabase
      .from("users")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (userData?.avatar_url && userData.avatar_url.includes('supabase')) {
      const oldFilePath = userData.avatar_url.split('/avatars/').pop();
      if (oldFilePath) {
        console.log("🗑️ Deleting old avatar:", oldFilePath);
        await supabase.storage
          .from("avatars")
          .remove([oldFilePath]);
      }
    }

    // Upload to Supabase Storage (avatars bucket)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
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
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl;

    console.log("🌍 Public URL:", avatarUrl);

    if (!avatarUrl) {
      console.error("❌ Failed to generate public URL");
      return NextResponse.json(
        { error: "Failed to generate image URL" },
        { status: 500 }
      );
    }

    // Update user's avatar_url in database
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", userId)
      .select("id, username, first_name, last_name, avatar_url, bio, role, created_at")
      .single();

    if (updateError) {
      console.error("❌ Failed to update user avatar:", updateError);
      return NextResponse.json(
        { error: "Failed to update avatar in database" },
        { status: 500 }
      );
    }

    console.log("✅ Avatar updated successfully");

    return NextResponse.json({ 
      avatar_url: avatarUrl,
      user: updatedUser 
    }, { status: 200 });

  } catch (error) {
    console.error("🔥 SERVER ERROR in POST /api/users/avatar:", error);
    return NextResponse.json(
      { error: "Server failed to upload avatar" },
      { status: 500 }
    );
  }
});