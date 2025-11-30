'use client'

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, UserPlus, MoreHorizontal, Trash2, Edit2, Shield } from 'lucide-react';
import { Post } from '@/types';
import CommentsModal from './CommentsModal';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  currentUserRole?: string; // ✅ Add role prop
  onLike: (postId: string) => void;
  onFollow: (userId: string) => void;
  onDelete?: (postId: string) => Promise<void>;
  onUpdate?: (postId: string, content: string) => Promise<void>;
  onRefresh?: () => void;
}

export default function PostCard({
  post,
  currentUserId,
  currentUserRole, // ✅ Destructure role
  onLike,
  onFollow,
  onDelete,
  onUpdate,
  onRefresh
}: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const isOwnPost = post.user?.id === currentUserId;
  const isAdmin = currentUserRole === 'admin'; // ✅ Check if user is admin
  const canDelete = isOwnPost || isAdmin; // ✅ Admin can delete any post
  const canEdit = isOwnPost; // Only owner can edit

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('❌ Failed to load image for post:', post.id);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully for post:', post.id);
  };

  const handleCommentClick = () => {
    console.log('💬 Opening comments modal');
    setShowCommentsModal(true);
  };

  const handleCommentAdded = () => {
    console.log('✅ Comment added, refreshing feed');
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDelete = async () => {
    console.log('🗑️ Delete button clicked');

    if (!onDelete) {
      console.error('❌ No onDelete handler provided!');
      alert('Delete functionality not available');
      return;
    }

    // ✅ Different confirmation message for admin
    const confirmMessage = isAdmin && !isOwnPost
      ? `⚠️ Admin Action: Are you sure you want to delete this post by @${post.user.username}? This action cannot be undone.`
      : 'Are you sure you want to delete this post?';

    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) {
      console.log('❌ User cancelled deletion');
      return;
    }

    console.log('🚀 Starting deletion process...');
    setIsDeleting(true);
    setShowMenu(false);

    try {
      console.log('📡 Calling onDelete handler...');
      await onDelete(post.id);
      console.log('✅ Post deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    console.log('✏️ Edit button clicked');
    setEditContent(post.content || '');
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleCancelEdit = () => {
    console.log('❌ Edit cancelled');
    setIsEditing(false);
    setEditContent(post.content || '');
  };

  const handleSaveEdit = async () => {
    console.log('💾 Save edit clicked');

    if (!onUpdate) {
      console.error('❌ No onUpdate handler provided!');
      alert('Update functionality not available');
      return;
    }

    if (!editContent.trim()) {
      alert('Post content cannot be empty');
      return;
    }

    console.log('🚀 Starting update process...');
    setIsUpdating(true);

    try {
      console.log('📡 Calling onUpdate handler...');
      await onUpdate(post.id, editContent.trim());
      console.log('✅ Post updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Failed to update post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
        {/* ✅ Admin Badge - Show when admin is viewing someone else's post */}
        {isAdmin && !isOwnPost && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
              <Shield className="w-3 h-3" />

            </span>
          </div>
        )}

        {/* Header */}
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

            {/* More Options Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                disabled={isEditing}
              >
                <MoreHorizontal className="w-5 h-5 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    {/* ✅ Show Edit only for own posts */}
                    {canEdit && (
                      <button
                        onClick={handleEdit}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Post
                      </button>
                    )}

                    {/* ✅ Show Delete for own posts OR admin */}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${isAdmin && !isOwnPost
                            ? 'text-purple-600 hover:bg-purple-50'
                            : 'text-red-600 hover:bg-red-50'
                          }`}
                      >
                        {isAdmin && !isOwnPost ? (
                          <>
                            <Shield className="w-4 h-4" />
                            {isDeleting ? 'Deleting...' : 'Delete (Admin)'}
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? 'Deleting...' : 'Delete Post'}
                          </>
                        )}
                      </button>
                    )}

                    {/* ✅ Report option for non-owners and non-admins */}
                    {!canDelete && !canEdit && (
                      <button
                        onClick={() => {
                          console.log('📢 Report post clicked (not implemented)');
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        Report Post
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content - Edit Mode */}
        {isEditing ? (
          <div className="px-4 pb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="What's on your mind?"
              disabled={isUpdating}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating || !editContent.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* Content - View Mode */
          post.content && (
            <div className="px-4 pb-3">
              <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
            </div>
          )
        )}

        {/* Image */}
        {post.image_url && !imageError && (
          <div className="relative">
            <img
              src={post.image_url}
              alt="Post content"
              className="w-full max-h-96 object-cover"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </div>
        )}

        {/* Image Error Message */}
        {post.image_url && imageError && (
          <div className="px-4 py-3 bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">Failed to load image</p>
            <p className="text-xs text-red-500 mt-1 break-all">{post.image_url}</p>
          </div>
        )}

        {/* Deleting Overlay */}
        {isDeleting && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Deleting post...</p>
            </div>
          </div>
        )}

        {/* Stats and Actions */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <span>{post.likes_count || 0} likes</span>
            <button
              onClick={handleCommentClick}
              className="hover:underline cursor-pointer"
            >
              {post.comments_count || 0} comments
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onLike(post.id)}
              disabled={isEditing}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${post.is_liked_by_current_user
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-600 hover:bg-gray-100'
                } disabled:opacity-50`}
            >
              <Heart className={`w-5 h-5 ${post.is_liked_by_current_user ? 'fill-current' : ''}`} />
              <span className="font-medium text-sm">Like</span>
            </button>

            <button
              onClick={handleCommentClick}
              disabled={isEditing}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium text-sm">Comment</span>
            </button>
          </div>
        </div>
      </article>

      {/* Comments Modal */}
      <CommentsModal
        postId={post.id}
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
}