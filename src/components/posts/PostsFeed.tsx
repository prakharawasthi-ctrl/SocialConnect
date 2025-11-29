// // 'use client'

// // import React from 'react';
// // import { Loader2 } from 'lucide-react';
// // import { Post } from '@/types';
// // import PostCard from './PostCard';

// // interface PostsFeedProps {
// //   posts: Post[];
// //   loading: boolean;
// //   currentUserId?: string;
// //   onLike: (postId: string) => void;
// //   onFollow: (userId: string) => void;
// // }

// // export default function PostsFeed({ 
// //   posts, 
// //   loading, 
// //   currentUserId, 
// //   onLike, 
// //   onFollow 
// // }: PostsFeedProps) {
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center py-8">
// //         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {posts.map(post => (
// //         <PostCard
// //           key={post.id}
// //           post={post}
// //           currentUserId={currentUserId}
// //           onLike={onLike}
// //           onFollow={onFollow}
// //         />
// //       ))}
// //     </div>
// //   );
// // }


// 'use client'

// import React from 'react';
// import { Loader2, RefreshCw } from 'lucide-react';
// import { Post } from '@/types';
// import PostCard from './PostCard';

// interface PostsFeedProps {
//   posts: Post[];
//   loading: boolean;
//   currentUserId?: string;
//   onLike: (postId: string) => void;
//   onFollow: (userId: string) => void;
//   onRefresh?: () => void; // Add refresh callback
// }

// export default function PostsFeed({ 
//   posts, 
//   loading, 
//   currentUserId, 
//   onLike, 
//   onFollow,
//   onRefresh
// }: PostsFeedProps) {
//   // Debug logging
//   React.useEffect(() => {
//     console.log('📊 PostsFeed rendered:');
//     console.log('  - Posts count:', posts.length);
//     console.log('  - Loading:', loading);
//     console.log('  - Posts with images:', posts.filter(p => p.image_url).length);
    
//     if (posts.length > 0) {
//       console.log('  - Sample post:', {
//         id: posts[0].id,
//         hasContent: !!posts[0].content,
//         hasImage: !!posts[0].image_url,
//         imageUrl: posts[0].image_url
//       });
//     } else {
//       console.log('  ⚠️ No posts to display');
//     }
//   }, [posts, loading]);

//   if (loading) {
//     return (
//       <div className="flex justify-center py-8">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (posts.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
//             <Loader2 className="w-8 h-8 text-gray-400" />
//           </div>
//           <div>
//             <p className="text-gray-700 font-medium mb-1">No posts yet</p>
//             <p className="text-sm text-gray-500">Be the first to share something!</p>
//           </div>
//           {onRefresh && (
//             <button
//               onClick={onRefresh}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh Posts
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {posts.map(post => (
//         <PostCard
//           key={post.id}
//           post={post}
//           currentUserId={currentUserId}
//           onLike={onLike}
//           onFollow={onFollow}
//         />
//       ))}
//     </div>
//   );
// }

'use client'

import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Post } from '@/types';
import PostCard from './PostCard';

interface PostsFeedProps {
  posts: Post[];
  loading: boolean;
  currentUserId?: string;
  onLike: (postId: string) => void;
  onFollow: (userId: string) => void;
  onRefresh?: () => void; // Add refresh callback
  onDelete?: (postId: string) => Promise<void>; // Add delete callback
}

export default function PostsFeed({ 
  posts, 
  loading, 
  currentUserId, 
  onLike, 
  onFollow,
  onRefresh,
  onDelete
}: PostsFeedProps) {
  // Debug logging
  React.useEffect(() => {
    console.log('📊 PostsFeed rendered:');
    console.log('  - Posts count:', posts.length);
    console.log('  - Loading:', loading);
    console.log('  - Posts with images:', posts.filter(p => p.image_url).length);
    
    if (posts.length > 0) {
      console.log('  - Sample post:', {
        id: posts[0].id,
        hasContent: !!posts[0].content,
        hasImage: !!posts[0].image_url,
        imageUrl: posts[0].image_url
      });
    } else {
      console.log('  ⚠️ No posts to display');
    }
  }, [posts, loading]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-1">No posts yet</p>
            <p className="text-sm text-gray-500">Be the first to share something!</p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Posts
            </button>
          )}
        </div>
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
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}