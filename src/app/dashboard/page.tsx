

'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Heart, MessageCircle, Share2, UserPlus, UserMinus, ImagePlus, X, Settings, Search, Bell, MoreHorizontal, Loader2, Users } from 'lucide-react';

interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
}

interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user: User;
  likes_count: number;
  comments_count: number;
  is_liked_by_current_user: boolean;
  is_following: boolean;
}

interface Follower {
  id: string;
  created_at: string;
  user: User;
}

interface CurrentUser extends User {
  followers_count: number;
  following_count: number;
  posts_count: number;
}

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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authUser && isAuthenticated) {
      fetchUserProfile();
      fetchPosts();
      fetchSuggestedUsers();
      fetchFollowers();
    }
  }, [authUser, isAuthenticated]);

  const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchUserProfile = async () => {
    if (!authUser) return;
    
    setCurrentUser({
      ...authUser,
      followers_count: 0,
      following_count: 0,
      posts_count: 0
    });
    setLoading(false);
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const response = await fetch('/api/posts?feedType=all', {
        headers: getAuthHeader()
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setPostsLoading(false);
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

      if (response.ok) {
        const data = await response.json();
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

  const handleUnfollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/followers?followingId=${userId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (response.ok) {
        setPosts(posts.map(p =>
          p.user.id === userId ? { ...p, is_following: false } : p
        ));
        fetchFollowers();
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleFollowSuggested = async (userId: string) => {
    try {
      const response = await fetch('/api/followers', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ followingId: userId })
      });

      if (response.ok) {
        setSuggestedUsers(suggestedUsers.filter(u => u.id !== userId));
        fetchFollowers();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && !postImage) return;

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          content: postContent,
          image_url: postImage
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setPostContent('');
        setPostImage(null);
        setShowCreatePost(false);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

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

  if (authLoading || loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SocialConnect
              </h1>
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-80">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative hover:bg-gray-100 p-2 rounded-full transition">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="hover:bg-gray-100 p-2 rounded-full transition">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <img
                src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-blue-500"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Card */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="px-4 pb-4">
                <img
                  src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-white -mt-10 mb-3"
                />
                <h3 className="font-bold text-lg">{currentUser.first_name} {currentUser.last_name}</h3>
                <p className="text-sm text-gray-500 mb-3">@{currentUser.username}</p>
                {currentUser.bio && <p className="text-sm text-gray-600 mb-4">{currentUser.bio}</p>}

                <div className="flex gap-4 text-sm mb-4">
                  <button 
                    onClick={() => {
                      setFollowersType('followers');
                      setShowFollowers(true);
                    }}
                    className="hover:underline"
                  >
                    <span className="font-bold text-gray-900">{currentUser.followers_count || 0}</span>
                    <span className="text-gray-500 ml-1">Followers</span>
                  </button>
                  <button 
                    onClick={() => {
                      setFollowersType('following');
                      setShowFollowers(true);
                    }}
                    className="hover:underline"
                  >
                    <span className="font-bold text-gray-900">{currentUser.following_count || 0}</span>
                    <span className="text-gray-500 ml-1">Following</span>
                  </button>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  View Profile
                </button>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* Create Post Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex gap-3">
                <img
                  src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition"
                >
                  What's on your mind, {currentUser.first_name}?
                </button>
              </div>

              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <ImagePlus className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Photo</span>
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map(post => (
                  <article key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                        {!post.is_following && authUser && post.user.id !== authUser.id && (
                          <button
                            onClick={() => handleFollow(post.user.id)}
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
                          onClick={() => handleLike(post.id)}
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
                ))}
              </div>
            )}
          </main>

          {/* Right Sidebar - Suggestions */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Suggested for you</h3>
              <div className="space-y-4">
                {suggestedUsers.slice(0, 5).map(user => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username}
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">{user.first_name}</h4>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollowSuggested(user.id)}
                      className="px-3 py-1.5 text-sm font-medium rounded-full transition bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-lg">Create Post</h3>
              <button
                onClick={() => {
                  setShowCreatePost(false);
                  setPostContent('');
                  setPostImage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex gap-3 mb-4">
                <img
                  src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-sm">{currentUser.first_name} {currentUser.last_name}</h4>
                  <p className="text-xs text-gray-500">Public</p>
                </div>
              </div>

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={`What's on your mind, ${currentUser.first_name}?`}
                className="w-full min-h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {postImage && (
                <div className="relative mt-4">
                  <img src={postImage} alt="Upload preview" className="w-full rounded-lg" />
                  <button
                    onClick={() => setPostImage(null)}
                    className="absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-70 rounded-full hover:bg-opacity-90 transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}

              <div className="mt-4 p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Add to your post</span>
                  <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-full transition">
                    <ImagePlus className="w-5 h-5 text-green-500" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <button
                onClick={handleCreatePost}
                disabled={!postContent.trim() && !postImage}
                className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Followers/Following Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="font-bold text-lg capitalize">{followersType}</h3>
              <button
                onClick={() => setShowFollowers(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
              {(followersType === 'followers' ? followers : following).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No {followersType} yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(followersType === 'followers' ? followers : following).map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + item.user.username}
                          alt={item.user.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-sm">{item.user.first_name} {item.user.last_name}</h4>
                          <p className="text-xs text-gray-500">@{item.user.username}</p>
                        </div>
                      </div>
                      {followersType === 'following' && (
                        <button
                          onClick={() => handleUnfollow(item.user.id)}
                          className="px-3 py-1.5 text-sm font-medium rounded-full transition bg-gray-200 text-gray-700 hover:bg-gray-300"
                        >
                          Unfollow
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}