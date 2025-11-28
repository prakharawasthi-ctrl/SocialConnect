'use client'

import React from 'react';
import { X, Users } from 'lucide-react';
import { Follower } from '@/types';

interface FollowersModalProps {
  type: 'followers' | 'following';
  data: Follower[];
  onClose: () => void;
  onUnfollow?: (userId: string) => void;
}

export default function FollowersModal({ 
  type, 
  data, 
  onClose, 
  onUnfollow 
}: FollowersModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-bold text-lg capitalize">{type}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
          {data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No {type} yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map(item => (
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
                  {type === 'following' && onUnfollow && (
                    <button
                      onClick={() => onUnfollow(item.user.id)}
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
  );
}