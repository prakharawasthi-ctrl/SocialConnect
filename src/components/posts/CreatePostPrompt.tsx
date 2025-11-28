'use client'

import React from 'react';
import { ImagePlus } from 'lucide-react';
import { CurrentUser } from '@/types';

interface CreatePostPromptProps {
  currentUser: CurrentUser;
  onOpenModal: () => void;
}

export default function CreatePostPrompt({ currentUser, onOpenModal }: CreatePostPromptProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex gap-3">
        <img
          src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
        <button
          onClick={onOpenModal}
          className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition"
        >
          What's on your mind, {currentUser.first_name}?
        </button>
      </div>

      <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onOpenModal}
          className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ImagePlus className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">Photo</span>
        </button>
      </div>
    </div>
  );
}