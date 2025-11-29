"use client";

import React, { useState } from "react";
import { X, Users, Loader2 } from "lucide-react";
import { Follower } from "@/types";

interface FollowersModalProps {
  type: "followers" | "following";
  data: Follower[];
  onClose: () => void;
  onFollowChange?: () => void; // 🔥 NEW
}

export default function FollowersModal({
  type,
  data,
  onClose,
  onFollowChange,
}: FollowersModalProps) {
  const [list, setList] = useState(data);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // -----------------------------
  // 🔥 NO TOKEN NEEDED — Cookies handle auth
  // -----------------------------

  const followUser = async (userId: string) => {
    setLoadingId(userId);

    // Optimistic UI
    setList((prev) =>
      prev.map((item) =>
        item.user.id === userId ? { ...item, isFollowing: true } : item
      )
    );

    try {
      const res = await fetch("/api/followers", {
        method: "POST",
        credentials: "include", // IMPORTANT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: userId }),
      });

      if (!res.ok) {
        console.error("Follow failed", await res.json());
      } else {
        onFollowChange?.(); // 🔥 Notify parent
      }
    } catch (err) {
      console.error("Follow error:", err);
    }

    setLoadingId(null);
  };

  const unfollowUser = async (userId: string) => {
    setLoadingId(userId);

    // 🔥 Optimistic UI → remove immediately
    const removedUser = list.find((u) => u.user.id === userId);
    setList((prev) => prev.filter((item) => item.user.id !== userId));

    try {
      const res = await fetch(`/api/followers?followingId=${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Unfollow failed", await res.json());
        // revert if failed
        if (removedUser) setList((prev) => [...prev, removedUser]);
      } else {
        onFollowChange?.(); // 🔥 Notify parent
      }
    } catch (err) {
      console.error("Unfollow error:", err);
      if (removedUser) setList((prev) => [...prev, removedUser]);
    }

    setLoadingId(null);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-300 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-lg border border-gray-400">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-bold text-lg capitalize">{type}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
          {list.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No {type} found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((item) => {
                const isLoading = loadingId === item.user.id;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          item.user.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user.username}`
                        }
                        alt={item.user.username}
                        className="w-12 h-12 rounded-full"
                      />

                      <div>
                        <h4 className="font-semibold text-sm">
                          {item.user.first_name} {item.user.last_name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          @{item.user.username}
                        </p>
                      </div>
                    </div>

                    <div>
                      {type === "following" ? (
                        <button
                          disabled={isLoading}
                          onClick={() => unfollowUser(item.user.id)}
                          className="px-3 py-1.5 text-sm font-medium rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Unfollow"
                          )}
                        </button>
                      ) : !item.isFollowing ? (
                        <button
                          disabled={isLoading}
                          onClick={() => followUser(item.user.id)}
                          className="px-3 py-1.5 text-sm font-medium rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Follow Back"
                          )}
                        </button>
                      ) : (
                        <button
                          disabled={isLoading}
                          onClick={() => unfollowUser(item.user.id)}
                          className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Unfollow"
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
  );
}
