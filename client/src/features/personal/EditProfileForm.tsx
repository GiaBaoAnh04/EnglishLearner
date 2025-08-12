import { EditProfileData } from "../../types/user";
import React, { useState } from "react";
import AvatarUpload from "./AvatartUpload";

interface EditProfileFormProps {
  editProfile: EditProfileData;
  setEditProfile: React.Dispatch<React.SetStateAction<EditProfileData>>;
  handleSaveProfile: () => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditProfileForm({
  editProfile,
  setEditProfile,
  handleSaveProfile,
  setIsEditing,
}: EditProfileFormProps) {
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const CLOUD_NAME = "dgbylpaqz"; // Lấy ở Dashboard
  const UPLOAD_PRESET = "ml_default"; // Preset unsigned

  const onSave = () => {
    handleSaveProfile();
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  const handleAvatarChange = async (file: File) => {
    if (!file) return;

    setLoadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (data.url) {
        setEditProfile((prev) => ({ ...prev, avatar: data.url }));
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoadingAvatar(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 relative transition-all duration-300 transform scale-95 md:scale-100">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
        >
          &times;
        </button>

        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Edit Profile
        </h3>

        <div className="space-y-6">
          <AvatarUpload
            avatar={editProfile.avatar}
            onFileSelect={handleAvatarChange}
          />

          {loadingAvatar && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Uploading...
            </p>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              type="text"
              value={editProfile.username}
              onChange={(e) =>
                setEditProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Bio
            </label>
            <textarea
              value={editProfile.bio}
              onChange={(e) =>
                setEditProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                loadingAvatar
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={loadingAvatar} // Vô hiệu hóa nút khi loading
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
