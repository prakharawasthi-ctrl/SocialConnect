
"use client";

import React, { useState, useEffect } from "react";
import { X, Users, Loader2, Trash2, Shield, User as UserIcon, Search } from "lucide-react";
import { CurrentUser } from "@/types";
import { supabase } from "@/lib/superbase/client";

interface AdminUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export default function AdminUsersModal({
  isOpen,
  onClose,
  currentUserId,
}: AdminUsersModalProps) {
  const [users, setUsers] = useState<CurrentUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<CurrentUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    user: CurrentUser | null;
  }>({ show: false, user: null });

  useEffect(() => {
    if (isOpen) {
      fetchUsersDirectly();
    }
  }, [isOpen]);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.username.toLowerCase().includes(query) ||
            user.first_name.toLowerCase().includes(query) ||
            user.last_name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  // Fetch users directly from Supabase
  const fetchUsersDirectly = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching users directly from database...");

      // Fetch all users from database
      const { data: allUsers, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Database error:", error);
        throw new Error("Failed to fetch users: " + error.message);
      }

      console.log("✅ Users fetched successfully");
      console.log("Number of users:", allUsers?.length || 0);

      // Cast to CurrentUser[] to satisfy TypeScript
      setUsers((allUsers || []) as CurrentUser[]);
      setFilteredUsers((allUsers || []) as CurrentUser[]);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      alert(error instanceof Error ? error.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: CurrentUser) => {
    setDeleteConfirm({ show: true, user });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.user) return;

    const userToDelete = deleteConfirm.user;
    setDeletingId(userToDelete.id);

    try {
      console.log("🗑️ Deleting user:", userToDelete.username);

      // Delete user from database
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userToDelete.id);

      if (deleteError) {
        console.error("❌ Delete error:", deleteError);
        throw new Error("Failed to delete user: " + deleteError.message);
      }

      console.log("✅ User deleted successfully");

      // Remove user from list
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setFilteredUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));

      // Close confirmation
      setDeleteConfirm({ show: false, user: null });
      
      alert(`User ${userToDelete.username} deleted successfully`);
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      alert(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          

          {/* Users List */}
          <div className="overflow-y-auto max-h-[calc(85vh-200px)]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-3" />
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const isCurrentUser = user.id === currentUserId;
                  const isDeleting = deletingId === user.id;

                  return (
                    <div
                      key={user.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        isCurrentUser ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* User Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <img
                            src={
                              user.avatar_url ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                            }
                            alt={user.username}
                            className="w-14 h-14 rounded-full border-2 border-gray-200"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {user.first_name} {user.last_name}
                              </h4>
                              {user.role && (
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
                                    user.role === "admin"
                                      ? "bg-purple-100 text-purple-700 border border-purple-200"
                                      : "bg-blue-100 text-blue-700 border border-blue-200"
                                  }`}
                                >
                                  {user.role === "admin" ? (
                                    <>
                                      <Shield className="w-3 h-3" />
                                      <span>Admin</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserIcon className="w-3 h-3" />
                                      <span>User</span>
                                    </>
                                  )}
                                </span>
                              )}
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              @{user.username}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                          <div className="text-center">
                            <div className="font-semibold">
                              {user.posts_count || 0}
                            </div>
                            <div className="text-xs">Posts</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">
                              {user.followers_count || 0}
                            </div>
                            <div className="text-xs">Followers</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">
                              {user.following_count || 0}
                            </div>
                            <div className="text-xs">Following</div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleDeleteClick(user)}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Deleting...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && deleteConfirm.user && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
            </div>

            <p className="text-gray-600 mb-2">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {deleteConfirm.user.username}
              </span>
              ?
            </p>

            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone. All user data, posts, comments, and
              relationships will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, user: null })}
                disabled={deletingId !== null}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId !== null}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingId !== null ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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