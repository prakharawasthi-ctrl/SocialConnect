
// 'use client'

// import React, { useState } from 'react';
// import { CurrentUser } from '@/types';
// import EditProfileModal from './EditProfileModal';
// import { Settings, Calendar, Grid } from 'lucide-react';

// interface ProfileSidebarProps {
//   currentUser: CurrentUser;
//   onShowFollowers: () => void;
//   onShowFollowing: () => void;
//   onShowPosts?: () => void;
//   onProfileUpdate?: (updatedUser: Partial<CurrentUser>) => void;
//   isShowingUserPosts?: boolean;
// }

// export default function ProfileSidebar({ 
//   currentUser, 
//   onShowFollowers, 
//   onShowFollowing,
//   onShowPosts,
//   onProfileUpdate,
//   isShowingUserPosts = false
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

//       if (onProfileUpdate) {
//         onProfileUpdate(updatedData);
//       }

//       window.location.reload();
//     } catch (error) {
//       console.error('❌ Error updating profile:', error);
//       throw error;
//     }
//   };

//   return (
//     <>
//       <aside className="lg:col-span-3">
//         <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24 transition-shadow hover:shadow-lg">
//           {/* Enhanced Cover Photo */}
//           <div className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
//             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
//             <button
//               onClick={() => setShowEditModal(true)}
//               className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 group"
//               title="Edit Profile"
//             >
//               <Settings className="w-4 h-4 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
//             </button>
//           </div>

//           <div className="px-5 pb-5">
//             {/* Profile Picture with Status */}
//             <div className="relative -mt-12 mb-4">
//               <div className="relative inline-block">
//                 <img
//                   src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
//                   alt="Profile"
//                   className="w-24 h-24 rounded-full border-4 border-white shadow-lg ring-2 ring-gray-100"
//                 />
//                 {/* Online Status Indicator */}
//                 <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
//               </div>
//             </div>

//             {/* User Info */}
//             <div className="mb-4">
//               <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">
//                 {currentUser.first_name} {currentUser.last_name}
//               </h3>
//               <p className="text-sm text-gray-500 mb-3">@{currentUser.username}</p>
              
//               {currentUser.bio && (
//                 <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3">
//                   {currentUser.bio}
//                 </p>
//               )}

//               {/* Join Date */}
//               {currentUser.created_at && (
//                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
//                   <Calendar className="w-3.5 h-3.5" />
//                   <span>
//                     Joined {new Date(currentUser.created_at).toLocaleDateString('en-US', { 
//                       month: 'long', 
//                       year: 'numeric' 
//                     })}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Stats - Enhanced with separators */}
//             <div className="flex items-center justify-around py-4 mb-4 bg-gray-50 rounded-lg">
//               <button 
//                 onClick={onShowFollowers}
//                 className="flex flex-col items-center group transition-transform hover:scale-105"
//               >
//                 <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                   {currentUser.followers_count || 0}
//                 </span>
//                 <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                   Followers
//                 </span>
//               </button>
              
//               <div className="h-10 w-px bg-gray-300"></div>
              
//               <button 
//                 onClick={onShowFollowing}
//                 className="flex flex-col items-center group transition-transform hover:scale-105"
//               >
//                 <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                   {currentUser.following_count || 0}
//                 </span>
//                 <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                   Following
//                 </span>
//               </button>

//               {currentUser.posts_count !== undefined && (
//                 <>
//                   <div className="h-10 w-px bg-gray-300"></div>
                  
//                   <button
//                     onClick={onShowPosts}
//                     className="flex flex-col items-center group transition-transform hover:scale-105"
//                   >
//                     <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                       {currentUser.posts_count || 0}
//                     </span>
//                     <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                       Posts
//                     </span>
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Show Posts Button */}
//             <button 
//               onClick={onShowPosts}
//               className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
//                 isShowingUserPosts
//                   ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
//                   : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
//               }`}
//             >
//               <Grid className="w-4 h-4" />
//               {isShowingUserPosts ? 'Show All Posts' : 'Show My Posts'}
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
// // }
// 'use client'

// import React, { useState } from 'react';
// import { CurrentUser } from '@/types';
// import EditProfileModal from './EditProfileModal';
// import { Settings, Calendar, Grid } from 'lucide-react';

// interface ProfileSidebarProps {
//   currentUser: CurrentUser;
//   onShowFollowers: () => void;
//   onShowFollowing: () => void;
//   onShowPosts?: () => void;
//   onProfileUpdate?: (updatedUser: Partial<CurrentUser>) => void;
//   isShowingUserPosts?: boolean;
// }

// export default function ProfileSidebar({ 
//   currentUser, 
//   onShowFollowers, 
//   onShowFollowing,
//   onShowPosts,
//   onProfileUpdate,
//   isShowingUserPosts = false
// }: ProfileSidebarProps) {
//   const [showEditModal, setShowEditModal] = useState(false);

//   const handleSaveProfile = async (updatedData: Partial<CurrentUser>) => {
//     try {
//       console.log('💾 Saving profile...', updatedData);
      
//       // Get token from localStorage
//       const token = localStorage.getItem('accessToken');
      
//       if (!token) {
//         throw new Error('Not authenticated. Please log in again.');
//       }

//       // Call the API to update the profile (changed to PATCH)
//       const response = await fetch('/api/users/profile', {
//         method: 'PATCH', // Changed from PUT to PATCH
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, // Added Authorization header
//         },
//         body: JSON.stringify(updatedData)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update profile');
//       }

//       console.log('✅ Profile updated successfully:', data.user);

//       // Update parent component
//       if (onProfileUpdate) {
//         onProfileUpdate(data.user);
//       }

//       // Reload to refresh everything
//       window.location.reload();
//     } catch (error) {
//       console.error('❌ Error updating profile:', error);
//       throw error;
//     }
//   };

//   return (
//     <>
//       <aside className="lg:col-span-3">
//         <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24 transition-shadow hover:shadow-lg">
//           {/* Enhanced Cover Photo */}
//           <div className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
//             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
//             <button
//               onClick={() => setShowEditModal(true)}
//               className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 group"
//               title="Edit Profile"
//             >
//               <Settings className="w-4 h-4 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
//             </button>
//           </div>

//           <div className="px-5 pb-5">
//             {/* Profile Picture with Status */}
//             <div className="relative -mt-12 mb-4">
//               <div className="relative inline-block">
//                 <img
//                   src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
//                   alt="Profile"
//                   className="w-24 h-24 rounded-full border-4 border-white shadow-lg ring-2 ring-gray-100"
//                 />
//                 {/* Online Status Indicator */}
//                 <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
//               </div>
//             </div>

//             {/* User Info */}
//             <div className="mb-4">
//               <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">
//                 {currentUser.first_name} {currentUser.last_name}
//               </h3>
//               <p className="text-sm text-gray-500 mb-3">@{currentUser.username}</p>
              
//               {currentUser.bio && (
//                 <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3">
//                   {currentUser.bio}
//                 </p>
//               )}

//               {/* Join Date */}
//               {currentUser.created_at && (
//                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
//                   <Calendar className="w-3.5 h-3.5" />
//                   <span>
//                     Joined {new Date(currentUser.created_at).toLocaleDateString('en-US', { 
//                       month: 'long', 
//                       year: 'numeric' 
//                     })}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Stats - Enhanced with separators */}
//             <div className="flex items-center justify-around py-4 mb-4 bg-gray-50 rounded-lg">
//               <button 
//                 onClick={onShowFollowers}
//                 className="flex flex-col items-center group transition-transform hover:scale-105"
//               >
//                 <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                   {currentUser.followers_count || 0}
//                 </span>
//                 <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                   Followers
//                 </span>
//               </button>
              
//               <div className="h-10 w-px bg-gray-300"></div>
              
//               <button 
//                 onClick={onShowFollowing}
//                 className="flex flex-col items-center group transition-transform hover:scale-105"
//               >
//                 <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                   {currentUser.following_count || 0}
//                 </span>
//                 <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                   Following
//                 </span>
//               </button>

//               {currentUser.posts_count !== undefined && (
//                 <>
//                   <div className="h-10 w-px bg-gray-300"></div>
                  
//                   <button
//                     onClick={onShowPosts}
//                     className="flex flex-col items-center group transition-transform hover:scale-105"
//                   >
//                     <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                       {currentUser.posts_count || 0}
//                     </span>
//                     <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                       Posts
//                     </span>
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Show Posts Button */}
//             {onShowPosts && (
//               <button 
//                 onClick={onShowPosts}
//                 className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
//                   isShowingUserPosts
//                     ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
//                     : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
//                 }`}
//               >
//                 <Grid className="w-4 h-4" />
//                 {isShowingUserPosts ? 'Show All Posts' : 'Show My Posts'}
//               </button>
//             )}
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
// 'use client'

// import React, { useState } from 'react';
// import { CurrentUser } from '@/types';
// import EditProfileModal from './EditProfileModal';
// import { Settings, Calendar, Grid } from 'lucide-react';

// interface ProfileSidebarProps {
//   currentUser: CurrentUser;
//   onShowFollowers: () => void;
//   onShowFollowing: () => void;
//   onShowPosts?: () => void;
//   onProfileUpdate?: (updatedUser: Partial<CurrentUser>) => void;
//   isShowingUserPosts?: boolean;
// }

// export default function ProfileSidebar({ 
//   currentUser, 
//   onShowFollowers, 
//   onShowFollowing,
//   onShowPosts,
//   onProfileUpdate,
//   isShowingUserPosts = false
// }: ProfileSidebarProps) {
//   const [showEditModal, setShowEditModal] = useState(false);

//   const handleSaveProfile = async (updatedData: Partial<CurrentUser>) => {
//     try {
//       console.log('💾 Saving profile...', updatedData);
      
//       // Call the API to update the profile
//       // ✅ NO Authorization header - auth is handled by httpOnly cookie automatically
//       const response = await fetch('/api/users/profile', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include', // ✅ Important: Include cookies in the request
//         body: JSON.stringify(updatedData)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Failed to update profile');
//       }

//       console.log('✅ Profile updated successfully:', data.user);

//       // Update parent component
//       if (onProfileUpdate) {
//         onProfileUpdate(data.user);
//       }

//       // Reload to refresh everything
//       window.location.reload();
//     } catch (error) {
//       console.error('❌ Error updating profile:', error);
//       throw error;
//     }
//   };

//   return (
//     <>
//       <aside className="lg:col-span-3">
//         <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24 transition-shadow hover:shadow-lg">
//           {/* Enhanced Cover Photo */}
//           <div className="relative h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
//             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
//             <button
//               onClick={() => setShowEditModal(true)}
//               className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200 group"
//               title="Edit Profile"
//             >
//               <Settings className="w-4 h-4 text-gray-700 group-hover:rotate-90 transition-transform duration-300" />
//             </button>
//           </div>

//           <div className="px-5 pb-5">
//             {/* Profile Picture with Status */}
//             <div className="relative -mt-12 mb-4">
//               <div className="relative inline-block">
//                 <img
//                   src={currentUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + currentUser.username}
//                   alt="Profile"
//                   className="w-24 h-24 rounded-full border-4 border-white shadow-lg ring-2 ring-gray-100"
//                 />
//                 {/* Online Status Indicator */}
//                 <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-white rounded-full"></div>
//               </div>
//             </div>

//             {/* User Info */}
//             <div className="mb-4">
//               <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">
//                 {currentUser.first_name} {currentUser.last_name}
//               </h3>
//               <p className="text-sm text-gray-500 mb-3">@{currentUser.username}</p>
              
//               {currentUser.bio && (
//                 <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3">
//                   {currentUser.bio}
//                 </p>
//               )}

//               {/* Join Date */}
//               {currentUser.created_at && (
//                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
//                   <Calendar className="w-3.5 h-3.5" />
//                   <span>
//                     Joined {new Date(currentUser.created_at).toLocaleDateString('en-US', { 
//                       month: 'long', 
//                       year: 'numeric' 
//                     })}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Stats - Enhanced with separators */}
//             <div className="flex items-center justify-around py-4 mb-4 bg-gray-50 rounded-lg">
//               <button 
//                 onClick={onShowFollowers}
//                 className="flex flex-col items-center group transition-transform hover:scale-105"
//               >
//                 <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                   {currentUser.followers_count || 0}
//                 </span>
//                 <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                   Followers
//                 </span>
//               </button>
              
//               <div className="h-10 w-px bg-gray-300"></div>
              
//               <button 
//                 onClick={onShowFollowing}
//                 className="flex flex-col items-center group transition-transform hover:scale-105"
//               >
//                 <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                   {currentUser.following_count || 0}
//                 </span>
//                 <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                   Following
//                 </span>
//               </button>

//               {currentUser.posts_count !== undefined && (
//                 <>
//                   <div className="h-10 w-px bg-gray-300"></div>
                  
//                   <button
//                     onClick={onShowPosts}
//                     className="flex flex-col items-center group transition-transform hover:scale-105"
//                   >
//                     <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
//                       {currentUser.posts_count || 0}
//                     </span>
//                     <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
//                       Posts
//                     </span>
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Show Posts Button */}
//             {onShowPosts && (
//               <button 
//                 onClick={onShowPosts}
//                 className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
//                   isShowingUserPosts
//                     ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
//                     : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
//                 }`}
//               >
//                 <Grid className="w-4 h-4" />
//                 {isShowingUserPosts ? 'Show All Posts' : 'Show My Posts'}
//               </button>
//             )}
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

import React, { useState, useEffect } from 'react';
import { CurrentUser } from '@/types';
import EditProfileModal from './EditProfileModal';
import { Settings, Calendar, Grid } from 'lucide-react';

interface ProfileSidebarProps {
  currentUser: CurrentUser;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
  onShowPosts?: () => void;
  onProfileUpdate?: (updatedUser: Partial<CurrentUser>) => void;
  isShowingUserPosts?: boolean;
}

export default function ProfileSidebar({ 
  currentUser, 
  onShowFollowers, 
  onShowFollowing,
  onShowPosts,
  onProfileUpdate,
  isShowingUserPosts = false
}: ProfileSidebarProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [displayUser, setDisplayUser] = useState(currentUser);

  // Update displayUser when currentUser prop changes
  useEffect(() => {
    setDisplayUser(currentUser);
  }, [currentUser]);

  const handleSaveProfile = async (updatedData: Partial<CurrentUser>) => {
    try {
      console.log('💾 Saving profile...', updatedData);
      
      // Call the API to update the profile
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      console.log('✅ Profile updated successfully:', data.user);

      // Update local state immediately (no reload needed)
      setDisplayUser(prev => ({ ...prev, ...data.user }));

      // Update parent component
      if (onProfileUpdate) {
        onProfileUpdate(data.user);
      }

      // Close modal
      setShowEditModal(false);

      console.log('✅ Profile UI updated successfully');
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
                  key={displayUser.avatar_url} // Force re-render when avatar changes
                  src={displayUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + displayUser.username}
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
                {displayUser.first_name} {displayUser.last_name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">@{displayUser.username}</p>
              
              {/* Bio - Always show the div to prevent layout shift */}
              <div className="min-h-[3rem]">
                {displayUser.bio ? (
                  <p className="text-sm text-gray-700 leading-relaxed mb-3 line-clamp-3">
                    {displayUser.bio}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic mb-3">
                    No bio yet. Click the settings icon to add one!
                  </p>
                )}
              </div>

              {/* Join Date */}
              {displayUser.created_at && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Joined {new Date(displayUser.created_at).toLocaleDateString('en-US', { 
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
                  {displayUser.followers_count || 0}
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
                  {displayUser.following_count || 0}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                  Following
                </span>
              </button>

              {displayUser.posts_count !== undefined && (
                <>
                  <div className="h-10 w-px bg-gray-300"></div>
                  
                  <button
                    onClick={onShowPosts}
                    className="flex flex-col items-center group transition-transform hover:scale-105"
                  >
                    <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {displayUser.posts_count || 0}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                      Posts
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Show Posts Button */}
            {onShowPosts && (
              <button 
                onClick={onShowPosts}
                className={`w-full py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                  isShowingUserPosts
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                <Grid className="w-4 h-4" />
                {isShowingUserPosts ? 'Show All Posts' : 'Show My Posts'}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Edit Profile Modal */}
      <EditProfileModal
        currentUser={displayUser}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
      />
    </>
  );
}



