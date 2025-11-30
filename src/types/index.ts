// src/types/index.ts

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string;
  email?: string;
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  location?: string;
  role?: "user" | "admin";
  is_active?: boolean;
  email_verified?: boolean;
  privacy_setting?: "public" | "private" | "followers_only";
  last_login?: string;
  created_at?: string;
  updated_at?: string;

  // Computed fields
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  is_following?: boolean;
}

export interface CurrentUser extends User {
  followers_count: number;
  following_count: number;
  posts_count: number;
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  error?: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  identifier: string;
  password: string;
}

// ============================================
// POST TYPES
// ============================================

export interface Post {
  id: string;
  author_id: string;  // ✅ Added this field
  content: string;
  image_url?: string | null;
  created_at: string;
  updated_at?: string;
  user: User;
  likes_count: number;
  comments_count: number;
  is_liked_by_current_user: boolean;
  is_following: boolean;
}

export interface CreatePostData {
  content: string;
  image_url?: string;
}

export interface UpdatePostData {
  content?: string;
  image_url?: string;
}

export interface FeedPost extends Post {
  user: User;
}

export interface FeedResponse {
  posts: FeedPost[];
  has_more: boolean;
  next_cursor?: string;
}

// ============================================
// FOLLOW TYPES
// ============================================

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Follower {
  id: string;
  created_at: string;
  user: User;
  isFollowing?: boolean;
  is_following?: boolean;
}

export interface FollowStats {
  followers_count: number;
  following_count: number;
  is_following?: boolean;
  is_followed_by?: boolean;
}

// ============================================
// LIKE TYPES
// ============================================

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

// ============================================
// COMMENT TYPES
// ============================================

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface CreateCommentData {
  post_id: string;
  content: string;
}

// ============================================
// PROFILE TYPES
// ============================================

export interface ProfileData {
  user: User;
  stats: {
    posts_count: number;
    followers_count: number;
    following_count: number;
  };
  is_following?: boolean;
  is_own_profile: boolean;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  location?: string;
  privacy_setting?: "public" | "private" | "followers_only";
}

// ============================================
// UPLOAD TYPES
// ============================================

export interface UploadResponse {
  url: string;
  path: string;
  error?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  cursor?: string;
}