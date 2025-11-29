// // 'use client'

// // import React from 'react';
// // import { Heart, MessageCircle, Share2, UserPlus, MoreHorizontal } from 'lucide-react';
// // import { Post } from '@/types';

// // interface PostCardProps {
// //   post: Post;
// //   currentUserId?: string;
// //   onLike: (postId: string) => void;
// //   onFollow: (userId: string) => void;
// // }

// // export default function PostCard({ post, currentUserId, onLike, onFollow }: PostCardProps) {
// //   const formatTimeAgo = (timestamp: string) => {
// //     const now = new Date();
// //     const posted = new Date(timestamp);
// //     const diffMs = now.getTime() - posted.getTime();
// //     const diffMins = Math.floor(diffMs / 60000);
// //     const diffHours = Math.floor(diffMins / 60);
// //     const diffDays = Math.floor(diffHours / 24);

// //     if (diffMins < 60) return `${diffMins}m ago`;
// //     if (diffHours < 24) return `${diffHours}h ago`;
// //     return `${diffDays}d ago`;
// //   };

// //   return (
// //     <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //       <div className="flex items-center justify-between p-4">
// //         <div className="flex items-center gap-3">
// //           <img
// //             src={post.user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.user.username}
// //             alt={post.user.username}
// //             className="w-10 h-10 rounded-full"
// //           />
// //           <div>
// //             <h4 className="font-semibold text-sm">{post.user.first_name} {post.user.last_name}</h4>
// //             <p className="text-xs text-gray-500">@{post.user.username} · {formatTimeAgo(post.created_at)}</p>
// //           </div>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           {!post.is_following && currentUserId && post.user.id !== currentUserId && (
// //             <button
// //               onClick={() => onFollow(post.user.id)}
// //               className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition"
// //             >
// //               <UserPlus className="w-3.5 h-3.5" />
// //               Follow
// //             </button>
// //           )}
// //           <button className="p-2 hover:bg-gray-100 rounded-full transition">
// //             <MoreHorizontal className="w-5 h-5 text-gray-600" />
// //           </button>
// //         </div>
// //       </div>

// //       <div className="px-4 pb-3">
// //         <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
// //       </div>

// //       {post.image_url && (
// //         <img
// //           src={post.image_url}
// //           alt="Post"
// //           className="w-full max-h-96 object-cover"
// //         />
// //       )}

// //       <div className="px-4 py-3 border-t border-gray-200">
// //         <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
// //           <span>{post.likes_count} likes</span>
// //           <span>{post.comments_count} comments</span>
// //         </div>

// //         <div className="flex gap-2">
// //           <button
// //             onClick={() => onLike(post.id)}
// //             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
// //               post.is_liked_by_current_user
// //                 ? 'text-red-500 bg-red-50'
// //                 : 'text-gray-600 hover:bg-gray-100'
// //             }`}
// //           >
// //             <Heart className={`w-5 h-5 ${post.is_liked_by_current_user ? 'fill-current' : ''}`} />
// //             <span className="font-medium text-sm">Like</span>
// //           </button>

// //           <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
// //             <MessageCircle className="w-5 h-5" />
// //             <span className="font-medium text-sm">Comment</span>
// //           </button>

// //           <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
// //             <Share2 className="w-5 h-5" />
// //             <span className="font-medium text-sm">Share</span>
// //           </button>
// //         </div>
// //       </div>
// //     </article>
// //   );
// // }
// 'use client'

// import React from 'react';
// import { Heart, MessageCircle, Share2, UserPlus, MoreHorizontal } from 'lucide-react';
// import { Post } from '@/types';

// interface PostCardProps {
//   post: Post;
//   currentUserId?: string;
//   onLike: (postId: string) => void;
//   onFollow: (userId: string) => void;
// }

// export default function PostCard({ post, currentUserId, onLike, onFollow }: PostCardProps) {
//   const [imageError, setImageError] = React.useState(false);

//   const formatTimeAgo = (timestamp: string) => {
//     const now = new Date();
//     const posted = new Date(timestamp);
//     const diffMs = now.getTime() - posted.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     return `${diffDays}d ago`;
//   };

//   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
//     console.error('❌ Failed to load image for post:', post.id);
//     console.error('❌ Image URL:', post.image_url);
//     setImageError(true);
//   };

//   const handleImageLoad = () => {
//     console.log('✅ Image loaded successfully for post:', post.id);
//   };

//   // Debug log when component renders
//   React.useEffect(() => {
//     if (post.image_url) {
//       console.log('🖼️ PostCard rendered with image:', {
//         postId: post.id,
//         imageUrl: post.image_url,
//         urlLength: post.image_url.length
//       });
//     }
//   }, [post.id, post.image_url]);

//   return (
//     <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4">
//         <div className="flex items-center gap-3">
//           <img
//             src={post.user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.user.username}
//             alt={post.user.username}
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <h4 className="font-semibold text-sm">{post.user.first_name} {post.user.last_name}</h4>
//             <p className="text-xs text-gray-500">@{post.user.username} · {formatTimeAgo(post.created_at)}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {!post.is_following && currentUserId && post.user.id !== currentUserId && (
//             <button
//               onClick={() => onFollow(post.user.id)}
//               className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition"
//             >
//               <UserPlus className="w-3.5 h-3.5" />
//               Follow
//             </button>
//           )}
//           <button className="p-2 hover:bg-gray-100 rounded-full transition">
//             <MoreHorizontal className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       {post.content && (
//         <div className="px-4 pb-3">
//           <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
//         </div>
//       )}

//       {/* Image */}
//       {post.image_url && !imageError && (
//         <div className="relative">
//           <img
//             src={post.image_url}
//             alt="Post content"
//             className="w-full max-h-96 object-cover"
//             onError={handleImageError}
//             onLoad={handleImageLoad}
//             loading="lazy"
//           />
//         </div>
//       )}

//       {/* Image Error Message (for debugging) */}
//       {post.image_url && imageError && (
//         <div className="px-4 py-3 bg-red-50 border border-red-200">
//           <p className="text-sm text-red-600">Failed to load image</p>
//           <p className="text-xs text-red-500 mt-1 break-all">{post.image_url}</p>
//         </div>
//       )}

//       {/* Stats and Actions */}
//       <div className="px-4 py-3 border-t border-gray-200">
//         <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
//           <span>{post.likes_count || 0} likes</span>
//           <span>{post.comments_count || 0} comments</span>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={() => onLike(post.id)}
//             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
//               post.is_liked_by_current_user
//                 ? 'text-red-500 bg-red-50'
//                 : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             <Heart className={`w-5 h-5 ${post.is_liked_by_current_user ? 'fill-current' : ''}`} />
//             <span className="font-medium text-sm">Like</span>
//           </button>

//           <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
//             <MessageCircle className="w-5 h-5" />
//             <span className="font-medium text-sm">Comment</span>
//           </button>

//           <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
//             <Share2 className="w-5 h-5" />
//             <span className="font-medium text-sm">Share</span>
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }


// 'use client'

// import React, { useState } from 'react';
// import { Heart, MessageCircle, Share2, UserPlus, MoreHorizontal, Trash2, Edit } from 'lucide-react';
// import { Post } from '@/types';

// interface PostCardProps {
//   post: Post;
//   currentUserId?: string;
//   onLike: (postId: string) => void;
//   onFollow: (userId: string) => void;
//   onDelete?: (postId: string) => void;
// }

// export default function PostCard({ post, currentUserId, onLike, onFollow, onDelete }: PostCardProps) {
//   const [imageError, setImageError] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const isOwnPost = post.user?.id === currentUserId;

//   const formatTimeAgo = (timestamp: string) => {
//     const now = new Date();
//     const posted = new Date(timestamp);
//     const diffMs = now.getTime() - posted.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     return `${diffDays}d ago`;
//   };

//   const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
//     console.error('❌ Failed to load image for post:', post.id);
//     console.error('❌ Image URL:', post.image_url);
//     setImageError(true);
//   };

//   const handleImageLoad = () => {
//     console.log('✅ Image loaded successfully for post:', post.id);
//   };

//   const handleDelete = async () => {
//     if (!onDelete) return;

//     const confirmed = window.confirm('Are you sure you want to delete this post?');
//     if (!confirmed) return;

//     console.log('🗑️ Deleting post:', post.id);
//     setIsDeleting(true);

//     try {
//       await onDelete(post.id);
//       console.log('✅ Post deleted successfully');
//     } catch (error) {
//       console.error('❌ Failed to delete post:', error);
//       alert('Failed to delete post. Please try again.');
//     } finally {
//       setIsDeleting(false);
//       setShowMenu(false);
//     }
//   };

//   // Debug log when component renders
//   React.useEffect(() => {
//     if (post.image_url) {
//       console.log('🖼️ PostCard rendered with image:', {
//         postId: post.id,
//         imageUrl: post.image_url,
//         urlLength: post.image_url.length
//       });
//     }
//   }, [post.id, post.image_url]);

//   return (
//     <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4">
//         <div className="flex items-center gap-3">
//           <img
//             src={post.user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + post.user.username}
//             alt={post.user.username}
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <h4 className="font-semibold text-sm">{post.user.first_name} {post.user.last_name}</h4>
//             <p className="text-xs text-gray-500">@{post.user.username} · {formatTimeAgo(post.created_at)}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {!post.is_following && currentUserId && post.user.id !== currentUserId && (
//             <button
//               onClick={() => onFollow(post.user.id)}
//               className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition"
//             >
//               <UserPlus className="w-3.5 h-3.5" />
//               Follow
//             </button>
//           )}
          
//           {/* More Options Menu */}
//           <div className="relative">
//             <button 
//               onClick={() => setShowMenu(!showMenu)}
//               className="p-2 hover:bg-gray-100 rounded-full transition"
//             >
//               <MoreHorizontal className="w-5 h-5 text-gray-600" />
//             </button>

//             {/* Dropdown Menu */}
//             {showMenu && (
//               <>
//                 <div 
//                   className="fixed inset-0 z-10" 
//                   onClick={() => setShowMenu(false)}
//                 />
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
//                   {isOwnPost ? (
//                     <>
//                       <button
//                         onClick={handleDelete}
//                         disabled={isDeleting}
//                         className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                         {isDeleting ? 'Deleting...' : 'Delete Post'}
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
//                     >
//                       Report Post
//                     </button>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       {post.content && (
//         <div className="px-4 pb-3">
//           <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
//         </div>
//       )}

//       {/* Image */}
//       {post.image_url && !imageError && (
//         <div className="relative">
//           <img
//             src={post.image_url}
//             alt="Post content"
//             className="w-full max-h-96 object-cover"
//             onError={handleImageError}
//             onLoad={handleImageLoad}
//             loading="lazy"
//           />
//         </div>
//       )}

//       {/* Image Error Message (for debugging) */}
//       {post.image_url && imageError && (
//         <div className="px-4 py-3 bg-red-50 border border-red-200">
//           <p className="text-sm text-red-600">Failed to load image</p>
//           <p className="text-xs text-red-500 mt-1 break-all">{post.image_url}</p>
//         </div>
//       )}

//       {/* Stats and Actions */}
//       <div className="px-4 py-3 border-t border-gray-200">
//         <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
//           <span>{post.likes_count || 0} likes</span>
//           <span>{post.comments_count || 0} comments</span>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={() => onLike(post.id)}
//             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
//               post.is_liked_by_current_user
//                 ? 'text-red-500 bg-red-50'
//                 : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             <Heart className={`w-5 h-5 ${post.is_liked_by_current_user ? 'fill-current' : ''}`} />
//             <span className="font-medium text-sm">Like</span>
//           </button>

//           <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
//             <MessageCircle className="w-5 h-5" />
//             <span className="font-medium text-sm">Comment</span>
//           </button>

//           <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
//             <Share2 className="w-5 h-5" />
//             <span className="font-medium text-sm">Share</span>
//           </button>
//         </div>
//       </div>
//     </article>
//   );
// }


'use client'

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, UserPlus, MoreHorizontal, Trash2 } from 'lucide-react';
import { Post } from '@/types';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike: (postId: string) => void;
  onFollow: (userId: string) => void;
  onDelete?: (postId: string) => Promise<void>;
}

export default function PostCard({ post, currentUserId, onLike, onFollow, onDelete }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnPost = post.user?.id === currentUserId;

  console.log('🔍 PostCard Debug:', {
    postId: post.id,
    postAuthorId: post.user?.id,
    currentUserId,
    isOwnPost,
    hasDeleteHandler: !!onDelete
  });

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
    console.error('❌ Image URL:', post.image_url);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully for post:', post.id);
  };

  const handleDelete = async () => {
    console.log('🗑️ Delete button clicked');
    console.log('  - Post ID:', post.id);
    console.log('  - Has onDelete handler:', !!onDelete);
    console.log('  - Is own post:', isOwnPost);

    if (!onDelete) {
      console.error('❌ No onDelete handler provided!');
      alert('Delete functionality not available');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this post?');
    console.log('  - User confirmed:', confirmed);
    
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

  // Debug log when component renders
  React.useEffect(() => {
    if (post.image_url) {
      console.log('🖼️ PostCard rendered with image:', {
        postId: post.id,
        imageUrl: post.image_url,
        urlLength: post.image_url.length
      });
    }
  }, [post.id, post.image_url]);

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              onClick={() => {
                console.log('⋮ Menu clicked, current state:', showMenu);
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => {
                    console.log('📍 Backdrop clicked, closing menu');
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  {isOwnPost ? (
                    <>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? 'Deleting...' : 'Delete Post'}
                      </button>
                    </>
                  ) : (
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

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        </div>
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
          <span>{post.comments_count || 0} comments</span>
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