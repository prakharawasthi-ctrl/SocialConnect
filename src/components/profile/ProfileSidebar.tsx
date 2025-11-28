'use client'

import React from 'react';
import { CurrentUser } from '@/types';

interface ProfileSidebarProps {
  currentUser: CurrentUser;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
}

export default function ProfileSidebar({ 
  currentUser, 
  onShowFollowers, 
  onShowFollowing 
}: ProfileSidebarProps) {
  return (
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
              onClick={onShowFollowers}
              className="hover:underline"
            >
              <span className="font-bold text-gray-900">{currentUser.followers_count || 0}</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </button>
            <button 
              onClick={onShowFollowing}
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
  );
}