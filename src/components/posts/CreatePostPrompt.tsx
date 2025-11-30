'use client'

import React from 'react';
import { ImagePlus, Edit3 } from 'lucide-react';
import { CurrentUser } from '@/types';

interface CreatePostPromptProps {
  currentUser: CurrentUser;
  onOpenModal: () => void;
}

export default function CreatePostPrompt({ currentUser, onOpenModal }: CreatePostPromptProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center gap-3">
        {/* User Avatar */}
        <img
          src={currentUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`}
          alt={currentUser.username}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
        />

        {/* Input-like Button */}
        <button
          onClick={onOpenModal}
          className="flex-1 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-left text-gray-500 transition-colors duration-200 border border-gray-200 hover:border-gray-300"
        >
          <span className="text-sm">What's on your mind, {currentUser.first_name}?</span>
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mt-4 pt-3">
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenModal}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
          >
            <div className="p-2 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
              <ImagePlus className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Photo</span>
          </button>

          <button
            onClick={onOpenModal}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
          >
            <div className="p-2 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Post</span>
          </button>
        </div>
      </div>
    </div>
  );
}