// 'use client'

// import React, { useState } from 'react';
// import { X, Camera, Loader2 } from 'lucide-react';
// import { CurrentUser } from '@/types';

// interface EditProfileModalProps {
//   currentUser: CurrentUser;
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (updatedData: Partial<CurrentUser>) => Promise<void>;
// }

// export default function EditProfileModal({ currentUser, isOpen, onClose, onSave }: EditProfileModalProps) {
//   const [formData, setFormData] = useState({
//     first_name: currentUser.first_name || '',
//     last_name: currentUser.last_name || '',
//     username: currentUser.username || '',
//     bio: currentUser.bio || '',
//     avatar_url: currentUser.avatar_url || ''
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setError('');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.first_name.trim() || !formData.last_name.trim()) {
//       setError('First name and last name are required');
//       return;
//     }

//     if (!formData.username.trim()) {
//       setError('Username is required');
//       return;
//     }

//     setSaving(true);
//     setError('');

//     try {
//       await onSave(formData);
//       onClose();
//     } catch (err: any) {
//       setError(err.message || 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">

//     {/* <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10"> */}
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
//           <h2 className="text-xl font-bold">Edit Profile</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6">
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
//               {error}
//             </div>
//           )}

//           {/* Avatar */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Profile Picture
//             </label>
//             <div className="flex items-center gap-4">
//               <img
//                 src={formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`}
//                 alt="Avatar"
//                 className="w-20 h-20 rounded-full"
//               />
//               <div className="flex-1">
//                 <input
//                   type="text"
//                   name="avatar_url"
//                   value={formData.avatar_url}
//                   onChange={handleChange}
//                   placeholder="Enter image URL"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   Paste an image URL or leave empty for default avatar
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* First Name */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               First Name *
//             </label>
//             <input
//               type="text"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Last Name */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Last Name *
//             </label>
//             <input
//               type="text"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Username */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Username *
//             </label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Bio */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Bio
//             </label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleChange}
//               rows={4}
//               maxLength={160}
//               placeholder="Tell us about yourself..."
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               {formData.bio.length}/160 characters
//             </p>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={saving}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 'Save Changes'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// // }
// 'use client'

// import React, { useState, useRef } from 'react';
// import { CurrentUser } from '@/types';
// import { X, Upload, Image as ImageIcon } from 'lucide-react';

// interface EditProfileModalProps {
//   currentUser: CurrentUser;
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (updatedData: Partial<CurrentUser>) => Promise<void>;
// }

// export default function EditProfileModal({
//   currentUser,
//   isOpen,
//   onClose,
//   onSave
// }: EditProfileModalProps) {
//   const [formData, setFormData] = useState({
//     first_name: currentUser.first_name || '',
//     last_name: currentUser.last_name || '',
//     bio: currentUser.bio || '',
//     avatar_url: currentUser.avatar_url || ''
//   });
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState('');
//   const [imagePreview, setImagePreview] = useState(currentUser.avatar_url || '');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   if (!isOpen) return null;

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       setError('Please select a valid image file');
//       return;
//     }

//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       setError('Image size must be less than 5MB');
//       return;
//     }

//     setSelectedFile(file);
//     setError('');

//     // Create preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSaving(true);
//     setError('');

//     try {
//       // If there's a new avatar, upload it along with all profile data
//       if (selectedFile) {
//         console.log('🖼️ Uploading avatar with profile update...');

//         // Convert file to base64
//         const reader = new FileReader();
//         const base64Promise = new Promise<string>((resolve, reject) => {
//           reader.onloadend = () => resolve(reader.result as string);
//           reader.onerror = reject;
//           reader.readAsDataURL(selectedFile);
//         });

//         const base64Data = await base64Promise;

//         // Get token
//         const token = localStorage.getItem('accessToken');
//         if (!token) {
//           throw new Error('No authentication token found. Please log in again.');
//         }

//         console.log('📤 Sending avatar + profile update request...');

//         // Send all data in one request
//         const uploadResponse = await fetch('/api/users/avatar', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           credentials: 'include',
//           body: JSON.stringify({ 
//             image: base64Data,
//             first_name: formData.first_name,
//             last_name: formData.last_name,
//             bio: formData.bio
//           })
//         });

//         const uploadData = await uploadResponse.json();

//         if (!uploadResponse.ok) {
//           console.error('❌ Upload failed:', uploadData);
//           throw new Error(uploadData.error || 'Failed to upload avatar');
//         }

//         console.log('✅ Avatar and profile updated successfully');
        
//         // Update parent component with returned user data
//         if (onSave && uploadData.user) {
//           await onSave(uploadData.user);
//         }
//       } else {
//         // No new avatar, just update profile fields
//         console.log('📝 Updating profile fields only...');
//         await onSave({
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           bio: formData.bio,
//           avatar_url: formData.avatar_url
//         });
//       }

//       console.log('✅ Profile update complete');
//       onClose();
//     } catch (err) {
//       console.error('❌ Error saving profile:', err);
//       setError(err instanceof Error ? err.message : 'Failed to save profile');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-5">
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {/* Avatar Upload */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Profile Picture
//             </label>
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <img
//                   src={imagePreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`}
//                   alt="Avatar preview"
//                   className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
//                 />
//                 {selectedFile && (
//                   <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
//                     <ImageIcon className="w-3 h-3 text-white" />
//                   </div>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileSelect}
//                   className="hidden"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="w-full px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
//                 >
//                   <Upload className="w-4 h-4" />
//                   Choose Image
//                 </button>
//                 <p className="text-xs text-gray-500 mt-2">
//                   JPG, PNG or GIF (max 5MB)
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* First Name */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               First Name
//             </label>
//             <input
//               type="text"
//               value={formData.first_name}
//               onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder="Enter first name"
//             />
//           </div>

//           {/* Last Name */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Last Name
//             </label>
//             <input
//               type="text"
//               value={formData.last_name}
//               onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               placeholder="Enter last name"
//             />
//           </div>

//           {/* Bio */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Bio
//             </label>
//             <textarea
//               value={formData.bio}
//               onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
//               rows={4}
//               maxLength={500}
//               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
//               placeholder="Tell us about yourself..."
//             />
//             <p className="text-xs text-gray-500 text-right">
//               {formData.bio.length}/500
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isSaving}
//               className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSaving}
//               className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//             >
//               {isSaving ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Saving...
//                 </>
//               ) : (
//                 'Save Changes'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client'

import React, { useState, useRef } from 'react';
import { CurrentUser } from '@/types';
import { X, Camera, Loader2 } from 'lucide-react';

interface EditProfileModalProps {
  currentUser: CurrentUser;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<CurrentUser>) => Promise<void>;
}

export default function EditProfileModal({
  currentUser,
  isOpen,
  onClose,
  onSave
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    first_name: currentUser.first_name || '',
    last_name: currentUser.last_name || '',
    username: currentUser.username || '',
    bio: currentUser.bio || '',
    avatar_url: currentUser.avatar_url || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(currentUser.avatar_url || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('First name and last name are required');
      return;
    }

    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      // If there's a new avatar, upload it along with all profile data
      if (selectedFile) {
        console.log('🖼️ Uploading avatar with profile update...');

        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        const base64Data = await base64Promise;

        // Get token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        console.log('📤 Sending avatar + profile update request...');

        // Send all data in one request
        const uploadResponse = await fetch('/api/users/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({ 
            image: base64Data,
            first_name: formData.first_name,
            last_name: formData.last_name,
            bio: formData.bio
          })
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          console.error('❌ Upload failed:', uploadData);
          throw new Error(uploadData.error || 'Failed to upload avatar');
        }

        console.log('✅ Avatar and profile updated successfully');
        
        // Update parent component with returned user data
        if (onSave && uploadData.user) {
          await onSave(uploadData.user);
        }
      } else {
        // No new avatar, just update profile fields
        console.log('📝 Updating profile fields only...');
        await onSave(formData);
      }

      console.log('✅ Profile update complete');
      onClose();
    } catch (err) {
      console.error('❌ Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Avatar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={imagePreview || formData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                {selectedFile && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Choose Image
                </button>
                <input
                  type="text"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  placeholder="Or enter image URL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload image or paste URL (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={160}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/160 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}