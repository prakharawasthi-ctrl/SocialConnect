// 'use client'

// import React, { useState } from 'react';
// import { User } from '@/types';

// interface SuggestedUsersProps {
//   users: User[];
//   onFollow: (userId: string, followersCount: number) => void; // include followers count
// }

// export default function SuggestedUsers({ users, onFollow }: SuggestedUsersProps) {
//   const [loadingIds, setLoadingIds] = useState<string[]>([]);

//   const handleFollowClick = async (userId: string) => {
//     try {
//       setLoadingIds(prev => [...prev, userId]);

//       const token = localStorage.getItem("accessToken");
//       if (!token) return;

//       const res = await fetch("/api/followers", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ followingId: userId })
//       });

//       if (!res.ok) throw new Error("Failed to follow user");

//       const data = await res.json();
//       const followersCount = data.followers_count || 0;

//       // Pass userId and followers count back to parent
//       onFollow(userId, followersCount);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingIds(prev => prev.filter(id => id !== userId));
//     }
//   };

//   return (
//     <aside className="lg:col-span-3">
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
//         <h3 className="font-bold text-lg mb-4">Suggested for you</h3>
//         <div className="space-y-4">
//           {users.slice(0, 100).map(user => (
//             <div key={user.id} className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <img
//                   src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
//                   alt={user.username}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div>
//                   <h4 className="font-semibold text-sm">{user.first_name}</h4>
//                   <p className="text-xs text-gray-500">@{user.username}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => handleFollowClick(user.id)}
//                 disabled={loadingIds.includes(user.id)}
//                 className="px-3 py-1.5 text-sm font-medium rounded-full transition bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loadingIds.includes(user.id) ? "Following..." : "Follow"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </aside>
//   );
// }
'use client'

import React, { useState } from 'react';
import { User } from '@/types';

interface SuggestedUsersProps {
  users: User[];
  onFollow: (userId: string, followersCount: number) => void; // include followers count
}

export default function SuggestedUsers({ users, onFollow }: SuggestedUsersProps) {
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const handleFollowClick = async (userId: string) => {
    try {
      setLoadingIds(prev => [...prev, userId]);

      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch("/api/followers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ followingId: userId })
      });

      if (!res.ok) throw new Error("Failed to follow user");

      const data = await res.json();
      const followersCount = data.followers_count || 0;

      // Pass userId and followers count back to parent
      onFollow(userId, followersCount);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== userId));
    }
  };

  return (
    <aside className="lg:col-span-3">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-lg">Suggested for you</h3>
          <p className="text-xs text-gray-500 mt-1">{users.length} users</p>
        </div>

        {/* Scrollable User List */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] p-4">
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No suggestions available</p>
            ) : (
              users.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.username}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm truncate">{user.first_name}</h4>
                      <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowClick(user.id)}
                    disabled={loadingIds.includes(user.id)}
                    className="px-3 py-1.5 text-sm font-medium rounded-full transition bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-2"
                  >
                    {loadingIds.includes(user.id) ? "Following..." : "Follow"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}