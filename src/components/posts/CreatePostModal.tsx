'use client'

import React from 'react';
import { X, ImagePlus } from 'lucide-react';
import { CurrentUser } from '@/types';

interface CreatePostModalProps {
  currentUser: CurrentUser;
  postContent: string;
  postImage: string | null;
  onContentChange: (content: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function CreatePostModal({
  currentUser,
  postContent,
  postImage,
  onContentChange,
  onImageUpload,
  onRemoveImage,
  onSubmit,
  onClose
}: CreatePostModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-bold text-lg">Create Post</h3>
          <button
            onClick={onClose}
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
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={`What's on your mind, ${currentUser.first_name}?`}
            className="w-full min-h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {postImage && (
            <div className="relative mt-4">
              <img src={postImage} alt="Upload preview" className="w-full rounded-lg" />
              <button
                onClick={onRemoveImage}
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
                  onChange={onImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            onClick={onSubmit}
            disabled={!postContent.trim() && !postImage}
            className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}