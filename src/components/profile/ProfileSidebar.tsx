// // 'use client'

// // import React from 'react';
// // import { CurrentUser } from '@/types';

// // interface ProfileSidebarProps {
// //   currentUser: CurrentUser;
// //   onShowFollowers: () => void;
// //   onShowFollowing: () => void;
// // }

// // export default function ProfileSidebar({ 
// //   currentUser, 
// //   onShowFollowers, 
// //   onShowFollowing 
// // }: ProfileSidebarProps) {
// //   return (
// //     <aside className="lg:col-span-3">
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
// //         <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-500"></div>
// //         <div className="px-4 pb-4">
// //           <img
// //             src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
// //             alt="Profile"
// //             className="w-20 h-20 rounded-full border-4 border-white -mt-10 mb-3"
// //           />
// //           <h3 className="font-bold text-lg">{currentUser.first_name} {currentUser.last_name}</h3>
// //           <p className="text-sm text-gray-500 mb-3">@{currentUser.username}</p>
// //           {currentUser.bio && <p className="text-sm text-gray-600 mb-4">{currentUser.bio}</p>}

// //           <div className="flex gap-4 text-sm mb-4">
// //             <button 
// //               onClick={onShowFollowers}
// //               className="hover:underline"
// //             >
// //               <span className="font-bold text-gray-900">{currentUser.followers_count || 0}</span>
// //               <span className="text-gray-500 ml-1">Followers</span>
// //             </button>
// //             <button 
// //               onClick={onShowFollowing}
// //               className="hover:underline"
// //             >
// //               <span className="font-bold text-gray-900">{currentUser.following_count || 0}</span>
// //               <span className="text-gray-500 ml-1">Following</span>
// //             </button>
// //           </div>

// //           <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition">
// //             View Profile
// //           </button>
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // }

// 'use client'

// import React, { useState } from 'react';
// import { CurrentUser } from '@/types';
// import EditProfileModal from './EditProfileModal';
// import { Settings } from 'lucide-react';

// interface ProfileSidebarProps {
//   currentUser: CurrentUser;
//   onShowFollowers: () => void;
//   onShowFollowing: () => void;
//   onProfileUpdate?: (updatedUser: Partial<CurrentUser>) => void;
// }

// export default function ProfileSidebar({ 
//   currentUser, 
//   onShowFollowers, 
//   onShowFollowing,
//   onProfileUpdate
// }: ProfileSidebarProps) {
//   const [showEditModal, setShowEditModal] = useState(false);

//   const handleSaveProfile = async (updatedData: Partial<CurrentUser>) => {
//     try {
//       const response = await fetch('/api/users/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify(updatedData)
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || 'Failed to update profile');
//       }

//       const data = await response.json();
//       console.log('✅ Profile updated successfully:', data);

//       // Notify parent component to refresh user data
//       if (onProfileUpdate) {
//         onProfileUpdate(updatedData);
//       }

//       // Optionally reload the page to refresh all user data
//       window.location.reload();
//     } catch (error) {
//       console.error('❌ Error updating profile:', error);
//       throw error;
//     }
//   };

//   return (
//     <>
//       <aside className="lg:col-span-3">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
//           <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-500 relative">
//             <button
//               onClick={() => setShowEditModal(true)}
//               className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
//               title="Edit Profile"
//             >
//               <Settings className="w-4 h-4 text-gray-600" />
//             </button>
//           </div>
//           <div className="px-4 pb-4">
//             <img
//               src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
//               alt="Profile"
//               className="w-20 h-20 rounded-full border-4 border-white -mt-10 mb-3"
//             />
//             <h3 className="font-bold text-lg">{currentUser.first_name} {currentUser.last_name}</h3>
//             <p className="text-sm text-gray-500 mb-3">@{currentUser.username}</p>
//             {currentUser.bio && <p className="text-sm text-gray-600 mb-4">{currentUser.bio}</p>}

//             <div className="flex gap-4 text-sm mb-4">
//               <button 
//                 onClick={onShowFollowers}
//                 className="hover:underline"
//               >
//                 <span className="font-bold text-gray-900">{currentUser.followers_count || 0}</span>
//                 <span className="text-gray-500 ml-1">Followers</span>
//               </button>
//               <button 
//                 onClick={onShowFollowing}
//                 className="hover:underline"
//               >
//                 <span className="font-bold text-gray-900">{currentUser.following_count || 0}</span>
//                 <span className="text-gray-500 ml-1">Following</span>
//               </button>
//             </div>

//             <button 
//               onClick={() => setShowEditModal(true)}
//               className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
//             >
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Edit Profile Modal */}
//       <EditProfileModal
//         currentUser={currentUser}
//         isOpen={showEditModal}
//         onClose={() => setShowEditModal(false)}
//         onSave={handleSaveProfile}
//       />
//     </>
//   );
// }
'use client'

import React, { useState } from 'react';
import { CurrentUser } from '@/types';
import EditProfileModal from './EditProfileModal';
import { Settings, Calendar } from 'lucide-react';

interface ProfileSidebarProps {
  currentUser: CurrentUser;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
  onProfileUpdate?: (updatedUser: Partial<CurrentUser>) => void;
}

export default function ProfileSidebar({ 
  currentUser, 
  onShowFollowers, 
  onShowFollowing,
  onProfileUpdate
}: ProfileSidebarProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSaveProfile = async (updatedData: Partial<CurrentUser>) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      const data = await response.json();
      console.log('✅ Profile updated successfully:', data);

      if (onProfileUpdate) {
        onProfileUpdate(updatedData);
      }

      window.location.reload();
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  };

  return (
    <>
      <aside className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24 transition-shadow hover:shadow-lg">
          {/* Enhanced Cover Photo */}
          <div className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 group"
              title="Edit Profile"
            >
              <Settings className="w-4 h-4 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="px-5 pb-5">
            {/* Profile Picture with Status */}
            <div className="relative -mt-12 mb-4">
              <div className="relative inline-block">
                <img
                  src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg ring-2 ring-gray-100"
                />
                {/* Online Status Indicator */}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-4">
              <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">
                {currentUser.first_name} {currentUser.last_name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">@{currentUser.username}</p>
              
              {currentUser.bio && (
                <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3">
                  {currentUser.bio}
                </p>
              )}

              {/* Join Date */}
              {currentUser.created_at && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Joined {new Date(currentUser.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Stats - Enhanced with separators */}
            <div className="flex items-center justify-around py-4 mb-4 bg-gray-50 rounded-lg">
              <button 
                onClick={onShowFollowers}
                className="flex flex-col items-center group transition-transform hover:scale-105"
              >
                <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {currentUser.followers_count || 0}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                  Followers
                </span>
              </button>
              
              <div className="h-10 w-px bg-gray-300"></div>
              
              <button 
                onClick={onShowFollowing}
                className="flex flex-col items-center group transition-transform hover:scale-105"
              >
                <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  {currentUser.following_count || 0}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                  Following
                </span>
              </button>

              {currentUser.posts_count !== undefined && (
                <>
                  <div className="h-10 w-px bg-gray-300"></div>
                  
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-gray-900">
                      {currentUser.posts_count || 0}
                    </span>
                    <span className="text-xs text-gray-500">
                      Posts
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Edit Profile Button - Enhanced */}
            <button 
              onClick={() => setShowEditModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </aside>

      {/* Edit Profile Modal */}
      <EditProfileModal
        currentUser={currentUser}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
      />
    </>
  );
}