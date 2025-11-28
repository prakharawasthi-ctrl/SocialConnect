'use client'

import React from 'react';
import { Heart, MessageCircle, Share2, UserPlus, MoreHorizontal } from 'lucide-react';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string) => void;
  onFollow: (userId: string) => void;
}

export default function PostCard({ post, currentUserId, onLike, onFollow }: PostCardProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffMs = now.getTime() - posted.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.user.username}
            alt={post.user.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h4 className="font-semibold text-sm">{post.user.first_name} {post.user.last_name}</h4>
            <p className="text-xs text-gray-500">@{post.user.username} · {formatTimeAgo(post.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!post.is_following && currentUserId && post.user.id !== currentUserId && (
            <button
              onClick={() => onFollow(post.user.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Follow
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {post.image_url && (
        <img
          src={post.image_url}
          alt="Post"
          className="w-full max-h-96 object-cover"
        />
      )}

      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{post.likes_count} likes</span>
          <span>{post.comments_count} comments</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onLike(post.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
              post.is_liked_by_current_user
                ? 'text-red-500 bg-red-50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.is_liked_by_current_user ? 'fill-current' : ''}`} />
            <span className="font-medium text-sm">Like</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Comment</span>
          </button>

          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
            <Share2 className="w-5 h-5" />
            <span className="font-medium text-sm">Share</span>
          </button>
        </div>
      </div>
    </article>
  );
}