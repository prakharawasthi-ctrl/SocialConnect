
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

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       router.push('/login');
//     }
//   }, [authLoading, isAuthenticated, router]);

//   useEffect(() => {
//     if (authUser && isAuthenticated) {
//       fetchUserProfile();
//       fetchPosts();
//       fetchSuggestedUsers();
//       fetchFollowers();
//     }
//   }, [authUser, isAuthenticated]);

//   const getAuthHeader = () => {
//     const token = localStorage.getItem('accessToken');
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   const fetchUserProfile = async () => {
//     if (!authUser) return;

//     setCurrentUser({
//       ...authUser,
//       followers_count: 0,
//       following_count: 0,
//       posts_count: 0
//     });
//     setLoading(false);
//   };

//   const fetchPosts = async () => {
//     setPostsLoading(true);
//     try {
//       const response = await fetch('/api/posts?feedType=all', {
//         headers: getAuthHeader()
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setPosts(data.posts);
//       }
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     } finally {
//       setPostsLoading(false);
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

//   const handleUnfollow = async (userId: string) => {
//     try {
//       const response = await fetch(`/api/followers?followingId=${userId}`, {
//         method: 'DELETE',
//         headers: getAuthHeader()
//       });

//       if (response.ok) {
//         setPosts(posts.map(p =>
//           p.user.id === userId ? { ...p, is_following: false } : p
//         ));
//         fetchFollowers();
//       }
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
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

//       // Remove user from suggested users
//       setSuggestedUsers(prev => prev.filter(u => u.id !== userId));

//       // Update current user's following count
//       setCurrentUser(prev => prev
//         ? { ...prev, following_count: data.following_count || (prev.following_count + 1) }
//         : prev
//       );

//       // Optionally: if you have a followers list or UI showing the followed user's followers,
//       // you can update that count here using data.followers_count
//       // e.g., update in a users array if stored

//     } catch (error) {
//       console.error('Error following user:', error);
//     }
//   };


//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPostImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCreatePost = async () => {
//     if (!postContent.trim() && !postImage) return;

//     try {
//       const response = await fetch('/api/posts', {
//         method: 'POST',
//         headers: getAuthHeader(),
//         body: JSON.stringify({
//           content: postContent,
//           image_url: postImage
//         })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setPosts([data.post, ...posts]);
//         setPostContent('');
//         setPostImage(null);
//         setShowCreatePost(false);
//       }
//     } catch (error) {
//       console.error('Error creating post:', error);
//     }
//   };

//   const handleCloseCreatePost = () => {
//     setShowCreatePost(false);
//     setPostContent('');
//     setPostImage(null);
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
//           />

//           <main className="lg:col-span-6">
//             <CreatePostPrompt
//               currentUser={currentUser}
//               onOpenModal={() => setShowCreatePost(true)}
//             />

//             <PostsFeed
//               posts={posts}
//               loading={postsLoading}
//               currentUserId={authUser?.id}
//               onLike={handleLike}
//               onFollow={handleFollow}
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
//           // onUnfollow={followersType === 'following' ? handleUnfollow : undefined}
//         />
//       )}
//     </div>
//   );
// }




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

//   useEffect(() => {
//     if (!authLoading && !isAuthenticated) {
//       router.push('/login');
//     }
//   }, [authLoading, isAuthenticated, router]);

//   useEffect(() => {
//     if (authUser && isAuthenticated) {
//       fetchUserProfile();
//       fetchPosts();
//       fetchSuggestedUsers();
//       fetchFollowers();
//     }
//   }, [authUser, isAuthenticated]);

//   // Debug logging for posts
//   useEffect(() => {
//     console.log('📊 Dashboard - Total posts:', posts.length);
//     console.log('📊 Dashboard - Posts with images:', posts.filter(p => p.image_url).length);
//     if (posts.length > 0) {
//       console.log('📊 Dashboard - Latest post:', posts[0]);
//     }
//   }, [posts]);

//   const getAuthHeader = () => {
//     const token = localStorage.getItem('accessToken');
//     return {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   const fetchUserProfile = async () => {
//     if (!authUser) return;

//     setCurrentUser({
//       ...authUser,
//       followers_count: 0,
//       following_count: 0,
//       posts_count: 0
//     });
//     setLoading(false);
//   };

//   const fetchPosts = async () => {
//     console.log('🔄 Fetching posts...');
//     setPostsLoading(true);
//     try {
//       const response = await fetch('/api/posts?feedType=all', {
//         headers: getAuthHeader()
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('✅ Posts fetched:', data.posts.length);
//         setPosts(data.posts);
//       } else {
//         console.error('❌ Failed to fetch posts:', response.status);
//       }
//     } catch (error) {
//       console.error('🔥 Error fetching posts:', error);
//     } finally {
//       setPostsLoading(false);
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

//   const handleUnfollow = async (userId: string) => {
//     try {
//       const response = await fetch(`/api/followers?followingId=${userId}`, {
//         method: 'DELETE',
//         headers: getAuthHeader()
//       });

//       if (response.ok) {
//         setPosts(posts.map(p =>
//           p.user.id === userId ? { ...p, is_following: false } : p
//         ));
//         fetchFollowers();
//       }
//     } catch (error) {
//       console.error('Error unfollowing user:', error);
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

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       console.log('📷 Image selected:', file.name, file.size, 'bytes');
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
//       console.log('📝 Content:', postContent);
//       console.log('🖼️ Has image:', !!postImage);

//       const response = await fetch('/api/posts', {
//         method: 'POST',
//         headers: getAuthHeader(),
//         body: JSON.stringify({
//           content: postContent,
//           image_url: postImage
//         })
//       });

//       console.log('📡 Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('❌ Failed to create post:', errorData);
//         alert(`Failed to create post: ${errorData.error || 'Unknown error'}`);
//         return;
//       }

//       const data = await response.json();
//       console.log('✅ Post created successfully:', data.post);
//       console.log('✅ Post image_url:', data.post.image_url);

//       // Add new post to the top of the feed
//       setPosts([data.post, ...posts]);

//       // Update posts count
//       setCurrentUser(prev => prev 
//         ? { ...prev, posts_count: prev.posts_count + 1 }
//         : prev
//       );

//       // Clear form
//       setPostContent('');
//       setPostImage(null);
//       setShowCreatePost(false);

//       console.log('✅ Post added to feed');

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
//           />

//           <main className="lg:col-span-6">
//             <CreatePostPrompt
//               currentUser={currentUser}
//               onOpenModal={() => setShowCreatePost(true)}
//             />

//             <PostsFeed
//               posts={posts}
//               loading={postsLoading}
//               currentUserId={authUser?.id}
//               onLike={handleLike}
//               onFollow={handleFollow}
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

//   // Redirect if not authenticated
//   useEffect(() => {
//     console.log('🔐 Auth check:', { authLoading, isAuthenticated, hasAuthUser: !!authUser });
    
//     if (!authLoading && !isAuthenticated) {
//       console.log('❌ Not authenticated, redirecting to login...');
//       router.push('/login');
//     }
//   }, [authLoading, isAuthenticated, router]);

//   // Fetch data when authenticated - THIS RUNS ON EVERY PAGE LOAD/REFRESH
//   useEffect(() => {
//     console.log('🔄 Main data fetch effect triggered');
//     console.log('  - authUser:', !!authUser);
//     console.log('  - isAuthenticated:', isAuthenticated);
    
//     if (authUser && isAuthenticated) {
//       console.log('✅ User is authenticated, fetching all data...');
      
//       // Fetch all data
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
//   }, [authUser, isAuthenticated]); // This dependency array ensures it runs on auth changes

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

//     console.log('👤 Fetching user profile...');
//     setCurrentUser({
//       ...authUser,
//       followers_count: 0,
//       following_count: 0,
//       posts_count: 0
//     });
//     setLoading(false);
//     console.log('✅ User profile set');
//   };

//   const fetchPosts = async () => {
//     console.log('📥 fetchPosts() called');
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
//         console.log('  - Posts with images:', data.posts.filter((p: Post) => p.image_url).length);
        
//         // Log each post with image
//         data.posts.forEach((post: Post, index: number) => {
//           if (post.image_url) {
//             console.log(`  📷 Post ${index + 1}:`, {
//               id: post.id,
//               content: post.content?.substring(0, 30) + '...',
//               imageUrl: post.image_url
//             });
//           }
//         });
        
//         setPosts(data.posts);
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
//       console.log('  - Content length:', postContent.length);
//       console.log('  - Has image:', !!postImage);
//       console.log('  - Image size:', postImage?.length || 0);

//       const response = await fetch('/api/posts', {
//         method: 'POST',
//         headers: getAuthHeader(),
//         body: JSON.stringify({
//           content: postContent,
//           image_url: postImage
//         })
//       });

//       console.log('📡 Create post response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('❌ Failed to create post:', errorData);
//         alert(`Failed to create post: ${errorData.error || 'Unknown error'}`);
//         return;
//       }

//       const data = await response.json();
//       console.log('✅ Post created successfully:', data.post);
//       console.log('  - Post ID:', data.post.id);
//       console.log('  - Image URL:', data.post.image_url);

//       // Add new post to the top of the feed
//       setPosts([data.post, ...posts]);
//       console.log('✅ Post added to feed');

//       // Update posts count
//       setCurrentUser(prev => prev 
//         ? { ...prev, posts_count: prev.posts_count + 1 }
//         : prev
//       );

//       // Clear form
//       setPostContent('');
//       setPostImage(null);
//       setShowCreatePost(false);

//       console.log('✅ Form cleared and modal closed');

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
//           />

//           <main className="lg:col-span-6">
//             <CreatePostPrompt
//               currentUser={currentUser}
//               onOpenModal={() => setShowCreatePost(true)}
//             />

//             <PostsFeed
//               posts={posts}
//               loading={postsLoading}
//               currentUserId={authUser?.id}
//               onLike={handleLike}
//               onFollow={handleFollow}
//               onRefresh={fetchPosts}
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

//   // Redirect if not authenticated
//   useEffect(() => {
//     console.log('🔐 Auth check:', { authLoading, isAuthenticated, hasAuthUser: !!authUser });
    
//     if (!authLoading && !isAuthenticated) {
//       console.log('❌ Not authenticated, redirecting to login...');
//       router.push('/login');
//     }
//   }, [authLoading, isAuthenticated, router]);

//   // Fetch data when authenticated - THIS RUNS ON EVERY PAGE LOAD/REFRESH
//   useEffect(() => {
//     console.log('🔄 Main data fetch effect triggered');
//     console.log('  - authUser:', !!authUser);
//     console.log('  - isAuthenticated:', isAuthenticated);
    
//     if (authUser && isAuthenticated) {
//       console.log('✅ User is authenticated, fetching all data...');
      
//       // Fetch all data
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
//   }, [authUser, isAuthenticated]); // This dependency array ensures it runs on auth changes

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

//     console.log('👤 Fetching user profile...');
//     setCurrentUser({
//       ...authUser,
//       followers_count: 0,
//       following_count: 0,
//       posts_count: 0
//     });
//     setLoading(false);
//     console.log('✅ User profile set');
//   };

//   const fetchPosts = async () => {
//     console.log('📥 fetchPosts() called');
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
//         console.log('  - Posts with images:', data.posts.filter((p: Post) => p.image_url).length);
        
//         // Log each post with image
//         data.posts.forEach((post: Post, index: number) => {
//           if (post.image_url) {
//             console.log(`  📷 Post ${index + 1}:`, {
//               id: post.id,
//               content: post.content?.substring(0, 30) + '...',
//               imageUrl: post.image_url
//             });
//           }
//         });
        
//         setPosts(data.posts);
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

//   const handleDeletePost = async (postId: string) => {
//     console.log('🗑️ Deleting post:', postId);

//     try {
//       const response = await fetch(`/api/posts/${postId}`, {
//         method: 'DELETE',
//         headers: getAuthHeader()
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to delete post');
//       }

//       console.log('✅ Post deleted from server');

//       // Remove post from local state
//       setPosts(prev => prev.filter(p => p.id !== postId));

//       // Update posts count
//       setCurrentUser(prev => prev 
//         ? { ...prev, posts_count: Math.max(0, prev.posts_count - 1) }
//         : prev
//       );

//       console.log('✅ Post removed from feed');

//     } catch (error) {
//       console.error('❌ Error deleting post:', error);
//       throw error; // Re-throw so PostCard can show error
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
//       console.log('  - Content length:', postContent.length);
//       console.log('  - Has image:', !!postImage);
//       console.log('  - Image size:', postImage?.length || 0);

//       const response = await fetch('/api/posts', {
//         method: 'POST',
//         headers: getAuthHeader(),
//         body: JSON.stringify({
//           content: postContent,
//           image_url: postImage
//         })
//       });

//       console.log('📡 Create post response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('❌ Failed to create post:', errorData);
//         alert(`Failed to create post: ${errorData.error || 'Unknown error'}`);
//         return;
//       }

//       const data = await response.json();
//       console.log('✅ Post created successfully:', data.post);
//       console.log('  - Post ID:', data.post.id);
//       console.log('  - Image URL:', data.post.image_url);

//       // Add new post to the top of the feed
//       setPosts([data.post, ...posts]);
//       console.log('✅ Post added to feed');

//       // Update posts count
//       setCurrentUser(prev => prev 
//         ? { ...prev, posts_count: prev.posts_count + 1 }
//         : prev
//       );

//       // Clear form
//       setPostContent('');
//       setPostImage(null);
//       setShowCreatePost(false);

//       console.log('✅ Form cleared and modal closed');

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
//           />

//           <main className="lg:col-span-6">
//             <CreatePostPrompt
//               currentUser={currentUser}
//               onOpenModal={() => setShowCreatePost(true)}
//             />

//             <PostsFeed
//               posts={posts}
//               loading={postsLoading}
//               currentUserId={authUser?.id}
//               onLike={handleLike}
//               onFollow={handleFollow}
//               onRefresh={fetchPosts}
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
import { Loader2 } from 'lucide-react';
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

  // Redirect if not authenticated
  useEffect(() => {
    console.log('🔐 Auth check:', { authLoading, isAuthenticated, hasAuthUser: !!authUser });
    
    if (!authLoading && !isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login...');
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch data when authenticated - THIS RUNS ON EVERY PAGE LOAD/REFRESH
  useEffect(() => {
    console.log('🔄 Main data fetch effect triggered');
    console.log('  - authUser:', !!authUser);
    console.log('  - isAuthenticated:', isAuthenticated);
    
    if (authUser && isAuthenticated) {
      console.log('✅ User is authenticated, fetching all data...');
      
      // Fetch all data
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
  }, [authUser, isAuthenticated]); // This dependency array ensures it runs on auth changes

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

    console.log('👤 Fetching user profile...');
    setCurrentUser({
      ...authUser,
      followers_count: 0,
      following_count: 0,
      posts_count: 0
    });
    setLoading(false);
    console.log('✅ User profile set');
  };

  const fetchPosts = async () => {
    console.log('📥 fetchPosts() called');
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
        console.log('  - Posts with images:', data.posts.filter((p: Post) => p.image_url).length);
        
        // Log each post with image
        data.posts.forEach((post: Post, index: number) => {
          if (post.image_url) {
            console.log(`  📷 Post ${index + 1}:`, {
              id: post.id,
              content: post.content?.substring(0, 30) + '...',
              imageUrl: post.image_url
            });
          }
        });
        
        setPosts(data.posts);
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

    try {
      const url = `/api/posts/${postId}`;
      console.log('📡 Sending DELETE request to:', url);
      
      const headers = getAuthHeader();
      console.log('🔑 Request headers:', headers);

      const response = await fetch(url, {
        method: 'DELETE',
        headers
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const responseData = await response.json();
      console.log('📡 Response data:', responseData);

      if (!response.ok) {
        console.error('❌ Delete request failed:', responseData);
        throw new Error(responseData.error || 'Failed to delete post');
      }

      console.log('✅ Post deleted from server successfully');

      // Remove post from local state
      console.log('🔄 Updating local state...');
      setPosts(prev => {
        const newPosts = prev.filter(p => p.id !== postId);
        console.log('  - Posts before:', prev.length);
        console.log('  - Posts after:', newPosts.length);
        return newPosts;
      });

      // Update posts count
      setCurrentUser(prev => prev 
        ? { ...prev, posts_count: Math.max(0, prev.posts_count - 1) }
        : prev
      );

      console.log('✅✅ Post successfully removed from feed ✅✅');

    } catch (error) {
      console.error('🔥 Error in handleDeletePost:', error);
      throw error; // Re-throw so PostCard can show error
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
      console.log('  - Content length:', postContent.length);
      console.log('  - Has image:', !!postImage);
      console.log('  - Image size:', postImage?.length || 0);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          content: postContent,
          image_url: postImage
        })
      });

      console.log('📡 Create post response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Failed to create post:', errorData);
        alert(`Failed to create post: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const data = await response.json();
      console.log('✅ Post created successfully:', data.post);
      console.log('  - Post ID:', data.post.id);
      console.log('  - Image URL:', data.post.image_url);

      // Add new post to the top of the feed
      setPosts([data.post, ...posts]);
      console.log('✅ Post added to feed');

      // Update posts count
      setCurrentUser(prev => prev 
        ? { ...prev, posts_count: prev.posts_count + 1 }
        : prev
      );

      // Clear form
      setPostContent('');
      setPostImage(null);
      setShowCreatePost(false);

      console.log('✅ Form cleared and modal closed');

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

  if (authLoading || loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentUser={currentUser} />

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
          />

          <main className="lg:col-span-6">
            <CreatePostPrompt
              currentUser={currentUser}
              onOpenModal={() => setShowCreatePost(true)}
            />

            <PostsFeed
              posts={posts}
              loading={postsLoading}
              currentUserId={authUser?.id}
              onLike={handleLike}
              onFollow={handleFollow}
              onRefresh={fetchPosts}
              onDelete={handleDeletePost}
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