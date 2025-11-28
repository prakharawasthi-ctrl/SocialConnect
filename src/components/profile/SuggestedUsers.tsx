'use client'

import React from 'react';
import { User } from '@/types';

interface SuggestedUsersProps {
  users: User[];
  onFollow: (userId: string) => void;
}

export default function SuggestedUsers({ users, onFollow }: SuggestedUsersProps) {
  return (
    <aside className="lg:col-span-3">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
        <h3 className="font-bold text-lg mb-4">Suggested for you</h3>
        <div className="space-y-4">
          {users.slice(0, 5).map(user => (
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
                onClick={() => onFollow(user.id)}
                className="px-3 py-1.5 text-sm font-medium rounded-full transition bg-blue-600 text-white hover:bg-blue-700"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}