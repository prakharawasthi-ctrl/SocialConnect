'use client'

import React from 'react';
import { Loader2 } from 'lucide-react';
import { Post } from '@/types';
import PostCard from './PostCard';

interface PostsFeedProps {
  posts: Post[];
  loading: boolean;
  currentUserId?: string;
  onLike: (postId: string) => void;
  onFollow: (userId: string) => void;
}

export default function PostsFeed({ 
  posts, 
  loading, 
  currentUserId, 
  onLike, 
  onFollow 
}: PostsFeedProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          onLike={onLike}
          onFollow={onFollow}
        />
      ))}
    </div>
  );
}