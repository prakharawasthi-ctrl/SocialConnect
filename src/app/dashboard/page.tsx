
// 'use client'

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/hooks/useAuth';
// import { Loader2 } from 'lucide-react';
// import { Post, User, Follower, CurrentUser } from '@/types';

// // Components
// import Navbar from '@/components/layout/navBar';
// import ProfileSidebar from '@/components/profile/ProfileSidebar';
// import CreatePostPrompt from '@/components/posts/CreatePostPrompt';
// import PostsFeed from '@/components/posts/PostsFeed';
// import CreatePostModal from '@/components/posts/CreatePostModal';
// import SuggestedUsers from '@/components/profile/SuggestedUsers';
// import FollowersModal from '@/components/profile/FollowersModal';

// export default function DashboardWithAPIs() {
//   const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();
//   const router = useRouter();

//   const [showCreatePost, setShowCreatePost] = useState(false);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [postContent, setPostContent] = useState('');
//   const [postImage, setPostImage] = useState<string | null>(null);
//   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
//   const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
//   const [followers, setFollowers] = useState<Follower[]>([]);
//   const [following, setFollowing] = useState<Follower[]>([]);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [followersType, setFollowersType] = useState<'followers' | 'following'>('followers');
//   const [loading, setLoading] = useState(true);
//   const [postsLoading, setPostsLoading] = useState(false);
//   const [isShowingUserPosts, setIsShowingUserPosts] = useState(false);

//   // Redirect if not authenticated
//   useEffect(() => {
//     console.log('🔐 Auth check:', { authLoading, isAuthenticated, hasAuthUser: !!authUser });
    
//     if (!authLoading && !isAuthenticated) {
//       console.log('❌ Not authenticated, redirecting to login...');
//       router.push('/login');
//     }
//   }, [authLoading, isAuthenticated, router]);

//   // Fetch data when authenticated
//   useEffect(() => {
//     console.log('🔄 Main data fetch effect triggered');
//     console.log('  - authUser:', !!authUser);
//     console.log('  - isAuthenticated:', isAuthenticated);
    
//     if (authUser && isAuthenticated) {
//       console.log('✅ User is authenticated, fetching all data...');
      
//       const fetchAllData = async () => {
//         await Promise.all([
//           fetchUserProfile(),
//           fetchPosts(),
//           fetchSuggestedUsers(),
//           fetchFollowers()
//         ]);
//         console.log('✅ All data fetched successfully');
//       };
      
//       fetchAllData();
//     }
//   }, [authUser, isAuthenticated]);

//   const getAuthHeader = () => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) {
//       console.error('❌ No access token found in localStorage');
//     } else {
//       console.log('✅ Access token found');
//     }
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   const fetchUserProfile = async () => {
//     if (!authUser) {
//       console.log('⚠️ No authUser, skipping profile fetch');
//       return;
//     }

//     console.log('👤 Fetching user profile from database...');
    
//     try {
//       const response = await fetch(`/api/users/${authUser.id}`, {
//         headers: getAuthHeader()
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('✅ User profile fetched from DB:', data.user);
//         setCurrentUser({
//           ...authUser,
//           ...data.user,
//           followers_count: data.user.followers_count || 0,
//           following_count: data.user.following_count || 0,
//           posts_count: data.user.posts_count || 0
//         });
//       } else {
//         console.log('⚠️ Failed to fetch from DB, using authUser');
//         setCurrentUser({
//           ...authUser,
//           followers_count: 0,
//           following_count: 0,
//           posts_count: 0
//         });
//       }
//     } catch (error) {
//       console.error('❌ Error fetching user profile:', error);
//       setCurrentUser({
//         ...authUser,
//         followers_count: 0,
//         following_count: 0,
//         posts_count: 0
//       });
//     }
    
//     setLoading(false);
//     console.log('✅ User profile set');
//   };

//   const fetchPosts = async () => {
//     console.log('📥 fetchPosts() called');
//     console.log('  - isShowingUserPosts:', isShowingUserPosts);
//     setPostsLoading(true);
    
//     try {
//       const url = '/api/posts?feedType=all';
//       console.log('📡 Fetching from:', url);
      
//       const response = await fetch(url, {
//         headers: getAuthHeader()
//       });

//       console.log('📡 Response status:', response.status);

//       if (response.ok) {
//         const data = await response.json();
//         console.log('✅ Posts fetched successfully:');
//         console.log('  - Total posts:', data.posts.length);
        
//         let filteredPosts = data.posts;
        
//         if (isShowingUserPosts && authUser) {
//           filteredPosts = data.posts.filter((post: Post) => post.user.id === authUser.id);
//           console.log('  - Filtered to user posts only:', filteredPosts.length);
//         } else if (!isShowingUserPosts && authUser) {
//           filteredPosts = data.posts.filter((post: Post) => post.user.id !== authUser.id);
//           console.log('  - Filtered to others posts only:', filteredPosts.length);
//         }
        
//         setPosts(filteredPosts);
//         console.log('✅ Posts state updated');
//       } else {
//         const errorData = await response.json();
//         console.error('❌ Failed to fetch posts:', response.status, errorData);
//       }
//     } catch (error) {
//       console.error('🔥 Error in fetchPosts:', error);
//     } finally {
//       setPostsLoading(false);
//       console.log('✅ fetchPosts completed');
//     }
//   };

//   const fetchFollowers = async () => {
//     try {
//       const [followersRes, followingRes] = await Promise.all([
//         fetch('/api/followers?type=followers', { headers: getAuthHeader() }),
//         fetch('/api/followers?type=following', { headers: getAuthHeader() })
//       ]);

//       if (followersRes.ok) {
//         const followersData = await followersRes.json();
//         setFollowers(followersData.followers);
//         setCurrentUser((prev: CurrentUser | null) => prev ? { ...prev, followers_count: followersData.total } : null);
//       }

//       if (followingRes.ok) {
//         const followingData = await followingRes.json();
//         setFollowing(followingData.following);
//         setCurrentUser((prev: CurrentUser | null) => prev ? { ...prev, following_count: followingData.total } : null);
//       }
//     } catch (error) {
//       console.error('Error fetching followers:', error);
//     }
//   };

//   const fetchSuggestedUsers = async () => {
//     try {
//       const response = await fetch('/api/suggestions', {
//         headers: getAuthHeader()
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuggestedUsers(data.users || []);
//       }
//     } catch (error) {
//       console.error('Error fetching suggested users:', error);
//     }
//   };

//   const handleLike = async (postId: string) => {
//     const post = posts.find(p => p.id === postId);
//     if (!post) return;

//     try {
//       const url = `/api/posts/${postId}/like`;
//       const method = post.is_liked_by_current_user ? 'DELETE' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: getAuthHeader()
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setPosts(posts.map(p =>
//           p.id === postId
//             ? {
//               ...p,
//               is_liked_by_current_user: !p.is_liked_by_current_user,
//               likes_count: data.likes_count
//             }
//             : p
//         ));
//       }
//     } catch (error) {
//       console.error('Error toggling like:', error);
//     }
//   };

//   const handleFollow = async (userId: string) => {
//     const post = posts.find(p => p.user.id === userId);
//     if (!post || post.is_following) return;

//     try {
//       const response = await fetch('/api/followers', {
//         method: 'POST',
//         headers: getAuthHeader(),
//         body: JSON.stringify({ followingId: userId })
//       });

//       if (response.ok) {
//         setPosts(posts.map(p =>
//           p.user.id === userId ? { ...p, is_following: true } : p
//         ));
//         fetchFollowers();
//       }
//     } catch (error) {
//       console.error('Error following user:', error);
//     }
//   };

//   const handleFollowSuggested = async (userId: string) => {
//     try {
//       const response = await fetch('/api/followers', {
//         method: 'POST',
//         headers: getAuthHeader(),
//         body: JSON.stringify({ followingId: userId })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to follow user');
//       }

//       const data = await response.json();

//       setSuggestedUsers(prev => prev.filter(u => u.id !== userId));
//       setCurrentUser(prev => prev
//         ? { ...prev, following_count: data.following_count || (prev.following_count + 1) }
//         : prev
//       );

//     } catch (error) {
//       console.error('Error following user:', error);
//     }
//   };

//   // ✅ Enhanced delete handler with admin support
//   const handleDeletePost = async (postId: string) => {
//     console.log('🗑️ handleDeletePost called');
//     console.log('  - Post ID:', postId);
//     console.log('  - Auth user:', authUser?.id);
//     console.log('  - User role:', currentUser?.role);

//     try {
//       const url = `/api/posts/${postId}`;
//       console.log('📡 Sending DELETE request to:', url);
      
//       const headers = getAuthHeader();

//       const response = await fetch(url, {
//         method: 'DELETE',
//         headers
//       });

//       console.log('📡 Response status:', response.status);

//       const responseData = await response.json();
//       console.log('📡 Response data:', responseData);

//       if (!response.ok) {
//         console.error('❌ Delete request failed:', responseData);
//         throw new Error(responseData.error || 'Failed to delete post');
//       }

//       console.log('✅ Post deleted from server successfully');

//       // Remove post from local state
//       setPosts(prev => {
//         const newPosts = prev.filter(p => p.id !== postId);
//         console.log('  - Posts before:', prev.length);
//         console.log('  - Posts after:', newPosts.length);
//         return newPosts;
//       });

//       // Update posts count only if it's the current user's post
//       const deletedPost = posts.find(p => p.id === postId);
//       if (deletedPost?.user.id === authUser?.id) {
//         setCurrentUser(prev => prev 
//           ? { ...prev, posts_count: Math.max(0, prev.posts_count - 1) }
//           : prev
//         );
//       }

//       console.log('✅✅ Post successfully removed from feed ✅✅');

//     } catch (error) {
//       console.error('🔥 Error in handleDeletePost:', error);
//       throw error;
//     }
//   };

//   // ✅ Add update handler for editing posts
//   const handleUpdatePost = async (postId: string, content: string) => {
//     console.log('✏️ handleUpdatePost called');
//     console.log('  - Post ID:', postId);
//     console.log('  - New content:', content);

//     try {
//       const url = `/api/posts/${postId}`;
//       console.log('📡 Sending PUT request to:', url);

//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: getAuthHeader(),
//         body: JSON.stringify({ content })
//       });

//       console.log('📡 Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('❌ Update request failed:', errorData);
//         throw new Error(errorData.error || 'Failed to update post');
//       }

//       const responseData = await response.json();
//       console.log('✅ Post updated successfully:', responseData.data);

//       // Update post in local state
//       setPosts(prev => prev.map(p => 
//         p.id === postId ? { ...p, content: responseData.data.content } : p
//       ));

//       console.log('✅ Post updated in feed');

//     } catch (error) {
//       console.error('🔥 Error in handleUpdatePost:', error);
//       throw error;
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       console.log('📷 Image selected:', {
//         name: file.name,
//         size: file.size,
//         type: file.type
//       });
      
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64 = reader.result as string;
//         console.log('✅ Image converted to base64, length:', base64.length);
//         setPostImage(base64);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreatePost = async () => {
//     if (!postContent.trim() && !postImage) {
//       console.log('❌ Cannot create empty post');
//       return;
//     }

//     try {
//       console.log('🚀 Creating post...');

//       const response = await fetch('/api/posts', {
//         method: 'POST',
//         headers: getAuthHeader(),
//         body: JSON.stringify({
//           content: postContent,
//           image_url: postImage
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('❌ Failed to create post:', errorData);
//         alert(`Failed to create post: ${errorData.error || 'Unknown error'}`);
//         return;
//       }

//       const data = await response.json();
//       console.log('✅ Post created successfully:', data.post);

//       if (!isShowingUserPosts || data.post.user.id === authUser?.id) {
//         setPosts([data.post, ...posts]);
//       }

//       setCurrentUser(prev => prev 
//         ? { ...prev, posts_count: prev.posts_count + 1 }
//         : prev
//       );

//       setPostContent('');
//       setPostImage(null);
//       setShowCreatePost(false);

//     } catch (error) {
//       console.error('🔥 Error creating post:', error);
//       alert('Failed to create post. Please try again.');
//     }
//   };

//   const handleCloseCreatePost = () => {
//     setShowCreatePost(false);
//     setPostContent('');
//     setPostImage(null);
//   };

//   const handleTogglePosts = () => {
//     console.log('🔄 Toggling posts view');
//     setIsShowingUserPosts(prev => !prev);
//   };

//   useEffect(() => {
//     if (authUser && isAuthenticated) {
//       console.log('🔄 Posts filter changed, refetching...');
//       fetchPosts();
//     }
//   }, [isShowingUserPosts]);

//   const handleProfileUpdate = (updatedData: Partial<CurrentUser>) => {
//     console.log('🔄 Profile updated, refreshing user data...');
//     setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
//   };

//   if (authLoading || loading || !currentUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar currentUser={currentUser} />

//       <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           <ProfileSidebar
//             currentUser={currentUser}
//             onShowFollowers={() => {
//               setFollowersType('followers');
//               setShowFollowers(true);
//             }}
//             onShowFollowing={() => {
//               setFollowersType('following');
//               setShowFollowers(true);
//             }}
//             onShowPosts={handleTogglePosts}
//             onProfileUpdate={handleProfileUpdate}
//             isShowingUserPosts={isShowingUserPosts}
//           />

//           <main className="lg:col-span-6">
//             {isShowingUserPosts && (
//               <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//                   <p className="text-sm text-blue-800 font-medium">
//                     Showing only your posts
//                   </p>
//                 </div>
//                 <button
//                   onClick={handleTogglePosts}
//                   className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
//                 >
//                   Show all posts
//                 </button>
//               </div>
//             )}

//             <CreatePostPrompt
//               currentUser={currentUser}
//               onOpenModal={() => setShowCreatePost(true)}
//             />

//             <PostsFeed
//               posts={posts}
//               loading={postsLoading}
//               currentUserId={authUser?.id}
//               currentUserRole={currentUser?.role}
//               onLike={handleLike}
//               onFollow={handleFollow}
//               onRefresh={fetchPosts}
//               onDelete={handleDeletePost}
//               onUpdate={handleUpdatePost}
//             />
//           </main>

//           <SuggestedUsers
//             users={suggestedUsers}
//             onFollow={handleFollowSuggested}
//           />
//         </div>
//       </div>

//       {showCreatePost && (
//         <CreatePostModal
//           currentUser={currentUser}
//           postContent={postContent}
//           postImage={postImage}
//           onContentChange={setPostContent}
//           onImageUpload={handleImageUpload}
//           onRemoveImage={() => setPostImage(null)}
//           onSubmit={handleCreatePost}
//           onClose={handleCloseCreatePost}
//         />
//       )}

//       {showFollowers && (
//         <FollowersModal
//           type={followersType}
//           data={followersType === 'followers' ? followers : following}
//           onClose={() => setShowFollowers(false)}
//         />
//       )}
//     </div>
//   );
// }
'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, LogOut } from 'lucide-react';
import { Post, User, Follower, CurrentUser } from '@/types';

// Components
import Navbar from '@/components/layout/navBar';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import CreatePostPrompt from '@/components/posts/CreatePostPrompt';
import PostsFeed from '@/components/posts/PostsFeed';
import CreatePostModal from '@/components/posts/CreatePostModal';
import SuggestedUsers from '@/components/profile/SuggestedUsers';
import FollowersModal from '@/components/profile/FollowersModal';

export default function DashboardWithAPIs() {
  const { user: authUser, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followersType, setFollowersType] = useState<'followers' | 'following'>('followers');
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isShowingUserPosts, setIsShowingUserPosts] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    console.log('🔐 Auth check:', { authLoading, isAuthenticated, hasAuthUser: !!authUser });
    
    if (!authLoading && !isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login...');
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch data when authenticated
  useEffect(() => {
    console.log('🔄 Main data fetch effect triggered');
    console.log('  - authUser:', !!authUser);
    console.log('  - isAuthenticated:', isAuthenticated);
    
    if (authUser && isAuthenticated) {
      console.log('✅ User is authenticated, fetching all data...');
      
      const fetchAllData = async () => {
        await Promise.all([
          fetchUserProfile(),
          fetchPosts(),
          fetchSuggestedUsers(),
          fetchFollowers()
        ]);
        console.log('✅ All data fetched successfully');
      };
      
      fetchAllData();
    }
  }, [authUser, isAuthenticated]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('❌ No access token found in localStorage');
    } else {
      console.log('✅ Access token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchUserProfile = async () => {
    if (!authUser) {
      console.log('⚠️ No authUser, skipping profile fetch');
      return;
    }

    console.log('👤 Fetching user profile from database...');
    
    try {
      const response = await fetch(`/api/users/${authUser.id}`, {
        headers: getAuthHeader()
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User profile fetched from DB:', data.user);
        setCurrentUser({
          ...authUser,
          ...data.user,
          followers_count: data.user.followers_count || 0,
          following_count: data.user.following_count || 0,
          posts_count: data.user.posts_count || 0
        });
      } else {
        console.log('⚠️ Failed to fetch from DB, using authUser');
        setCurrentUser({
          ...authUser,
          followers_count: 0,
          following_count: 0,
          posts_count: 0
        });
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      setCurrentUser({
        ...authUser,
        followers_count: 0,
        following_count: 0,
        posts_count: 0
      });
    }
    
    setLoading(false);
    console.log('✅ User profile set');
  };

  const fetchPosts = async () => {
    console.log('📥 fetchPosts() called');
    console.log('  - isShowingUserPosts:', isShowingUserPosts);
    setPostsLoading(true);
    
    try {
      const url = '/api/posts?feedType=all';
      console.log('📡 Fetching from:', url);
      
      const response = await fetch(url, {
        headers: getAuthHeader()
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Posts fetched successfully:');
        console.log('  - Total posts:', data.posts.length);
        
        let filteredPosts = data.posts;
        
        if (isShowingUserPosts && authUser) {
          filteredPosts = data.posts.filter((post: Post) => post.user.id === authUser.id);
          console.log('  - Filtered to user posts only:', filteredPosts.length);
        } else if (!isShowingUserPosts && authUser) {
          filteredPosts = data.posts.filter((post: Post) => post.user.id !== authUser.id);
          console.log('  - Filtered to others posts only:', filteredPosts.length);
        }
        
        setPosts(filteredPosts);
        console.log('✅ Posts state updated');
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to fetch posts:', response.status, errorData);
      }
    } catch (error) {
      console.error('🔥 Error in fetchPosts:', error);
    } finally {
      setPostsLoading(false);
      console.log('✅ fetchPosts completed');
    }
  };

  const fetchFollowers = async () => {
    try {
      const [followersRes, followingRes] = await Promise.all([
        fetch('/api/followers?type=followers', { headers: getAuthHeader() }),
        fetch('/api/followers?type=following', { headers: getAuthHeader() })
      ]);

      if (followersRes.ok) {
        const followersData = await followersRes.json();
        setFollowers(followersData.followers);
        setCurrentUser((prev: CurrentUser | null) => prev ? { ...prev, followers_count: followersData.total } : null);
      }

      if (followingRes.ok) {
        const followingData = await followingRes.json();
        setFollowing(followingData.following);
        setCurrentUser((prev: CurrentUser | null) => prev ? { ...prev, following_count: followingData.total } : null);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const response = await fetch('/api/suggestions', {
        headers: getAuthHeader()
      });

      const data = await response.json();

      if (response.ok) {
        setSuggestedUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      const url = `/api/posts/${postId}/like`;
      const method = post.is_liked_by_current_user ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeader()
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(p =>
          p.id === postId
            ? {
              ...p,
              is_liked_by_current_user: !p.is_liked_by_current_user,
              likes_count: data.likes_count
            }
            : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFollow = async (userId: string) => {
    const post = posts.find(p => p.user.id === userId);
    if (!post || post.is_following) return;

    try {
      const response = await fetch('/api/followers', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ followingId: userId })
      });

      if (response.ok) {
        setPosts(posts.map(p =>
          p.user.id === userId ? { ...p, is_following: true } : p
        ));
        fetchFollowers();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleFollowSuggested = async (userId: string) => {
    try {
      const response = await fetch('/api/followers', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ followingId: userId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to follow user');
      }

      const data = await response.json();

      setSuggestedUsers(prev => prev.filter(u => u.id !== userId));
      setCurrentUser(prev => prev
        ? { ...prev, following_count: data.following_count || (prev.following_count + 1) }
        : prev
      );

    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    console.log('🗑️ handleDeletePost called');
    console.log('  - Post ID:', postId);
    console.log('  - Auth user:', authUser?.id);
    console.log('  - User role:', currentUser?.role);

    try {
      const url = `/api/posts/${postId}`;
      console.log('📡 Sending DELETE request to:', url);
      
      const headers = getAuthHeader();

      const response = await fetch(url, {
        method: 'DELETE',
        headers
      });

      console.log('📡 Response status:', response.status);

      const responseData = await response.json();
      console.log('📡 Response data:', responseData);

      if (!response.ok) {
        console.error('❌ Delete request failed:', responseData);
        throw new Error(responseData.error || 'Failed to delete post');
      }

      console.log('✅ Post deleted from server successfully');

      setPosts(prev => {
        const newPosts = prev.filter(p => p.id !== postId);
        console.log('  - Posts before:', prev.length);
        console.log('  - Posts after:', newPosts.length);
        return newPosts;
      });

      const deletedPost = posts.find(p => p.id === postId);
      if (deletedPost?.user.id === authUser?.id) {
        setCurrentUser(prev => prev 
          ? { ...prev, posts_count: Math.max(0, prev.posts_count - 1) }
          : prev
        );
      }

      console.log('✅✅ Post successfully removed from feed ✅✅');

    } catch (error) {
      console.error('🔥 Error in handleDeletePost:', error);
      throw error;
    }
  };

  const handleUpdatePost = async (postId: string, content: string) => {
    console.log('✏️ handleUpdatePost called');
    console.log('  - Post ID:', postId);
    console.log('  - New content:', content);

    try {
      const url = `/api/posts/${postId}`;
      console.log('📡 Sending PUT request to:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ content })
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Update request failed:', errorData);
        throw new Error(errorData.error || 'Failed to update post');
      }

      const responseData = await response.json();
      console.log('✅ Post updated successfully:', responseData.data);

      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, content: responseData.data.content } : p
      ));

      console.log('✅ Post updated in feed');

    } catch (error) {
      console.error('🔥 Error in handleUpdatePost:', error);
      throw error;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('📷 Image selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        console.log('✅ Image converted to base64, length:', base64.length);
        setPostImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && !postImage) {
      console.log('❌ Cannot create empty post');
      return;
    }

    try {
      console.log('🚀 Creating post...');

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          content: postContent,
          image_url: postImage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to create post:', errorData);
        alert(`Failed to create post: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Post created successfully:', data.post);

      if (!isShowingUserPosts || data.post.user.id === authUser?.id) {
        setPosts([data.post, ...posts]);
      }

      setCurrentUser(prev => prev 
        ? { ...prev, posts_count: prev.posts_count + 1 }
        : prev
      );

      setPostContent('');
      setPostImage(null);
      setShowCreatePost(false);

    } catch (error) {
      console.error('🔥 Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleCloseCreatePost = () => {
    setShowCreatePost(false);
    setPostContent('');
    setPostImage(null);
  };

  const handleTogglePosts = () => {
    console.log('🔄 Toggling posts view');
    setIsShowingUserPosts(prev => !prev);
  };

  // ✅ NEW: Logout handler
  const handleLogout = () => {
    console.log('🚪 Logging out...');
    
    // Clear tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    console.log('✅ Tokens cleared');
    
    // Redirect to login page
    router.push('/login');
  };

  useEffect(() => {
    if (authUser && isAuthenticated) {
      console.log('🔄 Posts filter changed, refetching...');
      fetchPosts();
    }
  }, [isShowingUserPosts]);

  const handleProfileUpdate = (updatedData: Partial<CurrentUser>) => {
    console.log('🔄 Profile updated, refreshing user data...');
    setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
  };

  if (authLoading || loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ProfileSidebar
            currentUser={currentUser}
            onShowFollowers={() => {
              setFollowersType('followers');
              setShowFollowers(true);
            }}
            onShowFollowing={() => {
              setFollowersType('following');
              setShowFollowers(true);
            }}
            onShowPosts={handleTogglePosts}
            onProfileUpdate={handleProfileUpdate}
            isShowingUserPosts={isShowingUserPosts}
          />

          <main className="lg:col-span-6">
            {isShowingUserPosts && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <p className="text-sm text-blue-800 font-medium">
                    Showing only your posts
                  </p>
                </div>
                <button
                  onClick={handleTogglePosts}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Show all posts
                </button>
              </div>
            )}

            <CreatePostPrompt
              currentUser={currentUser}
              onOpenModal={() => setShowCreatePost(true)}
            />

            <PostsFeed
              posts={posts}
              loading={postsLoading}
              currentUserId={authUser?.id}
              currentUserRole={currentUser?.role}
              onLike={handleLike}
              onFollow={handleFollow}
              onRefresh={fetchPosts}
              onDelete={handleDeletePost}
              onUpdate={handleUpdatePost}
            />
          </main>

          <SuggestedUsers
            users={suggestedUsers}
            onFollow={handleFollowSuggested}
          />
        </div>
      </div>

      {showCreatePost && (
        <CreatePostModal
          currentUser={currentUser}
          postContent={postContent}
          postImage={postImage}
          onContentChange={setPostContent}
          onImageUpload={handleImageUpload}
          onRemoveImage={() => setPostImage(null)}
          onSubmit={handleCreatePost}
          onClose={handleCloseCreatePost}
        />
      )}

      {showFollowers && (
        <FollowersModal
          type={followersType}
          data={followersType === 'followers' ? followers : following}
          onClose={() => setShowFollowers(false)}
        />
      )}
    </div>
  );
}