'use client'

import React, { useState, useEffect } from 'react';
import { CurrentUser } from '@/types';
import EditProfileModal from './EditProfileModal';
import AdminUsersModal from './AdminUsersModal';
import { Settings, Calendar, Grid, Shield, User, Trash2, Users } from 'lucide-react';

interface ProfileSidebarProps {
  currentUser: CurrentUser;
  profileUser?: CurrentUser;
  isOwnProfile?: boolean;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
  onShowPosts?: () => void;
  onProfileUpdate?: (updatedUser: Partial<CurrentUser>) => void;
  onUserDeleted?: () => void;
  isShowingUserPosts?: boolean;
}

export default function ProfileSidebar({
  currentUser,
  profileUser,
  isOwnProfile = true,
  onShowFollowers,
  onShowFollowing,
  onShowPosts,
  onProfileUpdate,
  onUserDeleted,
  isShowingUserPosts = false
}: ProfileSidebarProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAdminUsersModal, setShowAdminUsersModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayUser, setDisplayUser] = useState(profileUser || currentUser);

  const isAdmin = currentUser.role === 'admin';
  const canDelete = isAdmin && !isOwnProfile && profileUser;

  useEffect(() => {
    setDisplayUser(profileUser || currentUser);
  }, [profileUser, currentUser]);

  const handleSaveProfile = async (updatedData: Partial<CurrentUser>) => {
    try {
      console.log('💾 Saving profile...', updatedData);

      const token = localStorage.getItem('accessToken');
      console.log('🔑 Token exists:', !!token);

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });

      console.log('📡 Response status:', response.status);
      const data = await response.json();
      console.log('📡 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      console.log('✅ Profile updated successfully:', data.user);

      setDisplayUser(prev => ({ ...prev, ...data.user }));

      if (onProfileUpdate) {
        onProfileUpdate(data.user);
      }

      console.log('✅ Profile UI updated successfully');
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  };

  const handleDeleteUser = async () => {
    if (!profileUser || !canDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/admin/users/${profileUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      console.log('✅ User deleted successfully');
      
      if (onUserDeleted) {
        onUserDeleted();
      }

      setShowDeleteConfirm(false);

    } catch (error) {
      console.error('❌ Error deleting user:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <aside className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24 transition-shadow hover:shadow-lg">
          {/* Enhanced Cover Photo */}
          <div className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              {/* Edit Button - Only show on own profile */}
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 group"
                  title="Edit Profile"
                >
                  <Settings className="w-4 h-4 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              )}
              
              {/* Delete Button - Only show for admin viewing other profiles */}
              {canDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 bg-red-500/95 backdrop-blur-sm rounded-full shadow-md hover:bg-red-600 hover:scale-110 transition-all duration-200 group"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
                </button>
              )}
            </div>
          </div>

          <div className="px-5 pb-5">
            {/* Profile Picture with Status */}
            <div className="relative -mt-12 mb-4">
              <div className="relative inline-block">
                <img
                  key={displayUser.avatar_url}
                  src={displayUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUser.username}`}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg ring-2 ring-gray-100"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl text-gray-900 leading-tight">
                    {displayUser.first_name} {displayUser.last_name}
                  </h3>
                </div>
                {displayUser.role && (
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                    displayUser.role === 'admin' 
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200 shadow-sm'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
                  }`}>
                    {displayUser.role === 'admin' ? (
                      <>
                        <Shield className="w-3 h-3" />
                        <span>Admin</span>
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3" />
                        <span>User</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-500 mb-3">@{displayUser.username}</p>

              <div className="min-h-[3rem]">
                {displayUser.bio ? (
                  <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3">
                    {displayUser.bio}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic mb-3">
                    {isOwnProfile ? 'No bio yet. Click the settings icon to add one!' : 'No bio'}
                  </p>
                )}
              </div>

              {displayUser.created_at && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Joined {new Date(displayUser.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-around py-4 mb-4 bg-gray-50 rounded-lg">
              <button
                onClick={onShowFollowers}
                className="flex flex-col items-center group transition-transform hover:scale-105"
              >
                <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {displayUser.followers_count || 0}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                  Followers
                </span>
              </button>

              <div className="h-10 w-px bg-gray-300"></div>

              <button
                onClick={onShowFollowing}
                className="flex flex-col items-center group transition-transform hover:scale-105"
              >
                <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {displayUser.following_count || 0}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                  Following
                </span>
              </button>

             
            </div>

            {/* Show Posts Button */}
            {onShowPosts && isOwnProfile && (
              <button
                onClick={onShowPosts}
                className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mb-3 ${
                  isShowingUserPosts
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                <Grid className="w-4 h-4" />
                {isShowingUserPosts ? 'Show All Posts' : 'Show My Posts'}
              </button>
            )}

            {/* Admin User Management Button */}
            {isAdmin && isOwnProfile && (
              <button
                onClick={() => setShowAdminUsersModal(true)}
                className="w-full py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
              >
                <Shield className="w-4 h-4" />
                Manage Users
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Edit Profile Modal */}
      {isOwnProfile && (
        <EditProfileModal
          currentUser={displayUser}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Admin Users Modal */}
      {isAdmin && (
        <AdminUsersModal
          isOpen={showAdminUsersModal}
          onClose={() => setShowAdminUsersModal(false)}
          currentUserId={currentUser.id}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete <span className="font-semibold">{displayUser.username}</span>?
            </p>
            
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone. All user data, posts, comments, and relationships will be permanently deleted.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}