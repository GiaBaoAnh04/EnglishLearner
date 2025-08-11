interface EditProfileData {
  username: string;
  bio: string;
  avatar: string;
}

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
  const onSave = () => {
    handleSaveProfile();
  };

  const onCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={editProfile.username}
              onChange={(e) =>
                setEditProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={editProfile.bio}
              onChange={(e) =>
                setEditProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Avatar URL</label>
            <input
              type="text"
              value={editProfile.avatar}
              onChange={(e) =>
                setEditProfile((prev) => ({ ...prev, avatar: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Save Changes
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
