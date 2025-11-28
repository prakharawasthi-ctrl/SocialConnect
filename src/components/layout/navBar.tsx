'use client'

import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { CurrentUser } from '@/types';

interface NavbarProps {
  currentUser: CurrentUser;
}

export default function Navbar({ currentUser }: NavbarProps) {
  return (
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
  );
}