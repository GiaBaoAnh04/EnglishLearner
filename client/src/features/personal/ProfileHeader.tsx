import React from "react";
import { Idiom } from "../../types/idiom"; // nếu đã tạo type Idiom dùng chung

export interface UserProfile {
  avatar?: string;
  username: string;
  bio?: string;
  level: string | number;
  createdAt: string;
}

interface ProfileHeaderProps {
  userProfile: UserProfile;
  myIdioms: Idiom[];
  onEdit: () => void;
  onCreate: () => void;
  isEditing: boolean;
}

export default function ProfileHeader({
  userProfile,
  myIdioms,
  onEdit,
  onCreate,
  isEditing,
}: ProfileHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={userProfile.avatar || "/assets/image/avatar.jpg"}
              alt={userProfile.username}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {userProfile.level}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {userProfile.username}
            </h1>
            <p className="text-blue-100 mb-4 max-w-md">
              {userProfile.bio || "Welcome to my idiom collection!"}
            </p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-start text-sm">
              <div>
                <span className="font-semibold text-lg">{myIdioms.length}</span>
                <div className="text-blue-100">Idioms Created</div>
              </div>
              <div>
                <span className="font-semibold text-lg">
                  {new Date(userProfile.createdAt).toLocaleDateString()}
                </span>
                <div className="text-blue-100">Member Since</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-medium"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            <button
              onClick={onCreate}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
            >
              Create Idiom
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
