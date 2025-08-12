import React, { useState } from "react";
import { Idiom } from "../../types/idiom";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEditClick = () => {
    onEdit();
    setIsMenuOpen(false); // Đóng menu sau khi click
  };

  const handleCreateClick = () => {
    onCreate();
    setIsMenuOpen(false); // Đóng menu sau khi click
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative">
          {/* Action Dropdown Menu - Đặt trong header */}
          <div className="absolute top-0 right-0 z-10">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Actions"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 6a2 2 0 100-4 2 2 0 000 4zM10 12a2 2 0 100-4 2 2 0 000 4zM10 18a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      onClick={handleEditClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {isEditing ? "Cancel Edit" : "Edit Profile"}
                    </button>
                    <button
                      onClick={handleCreateClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Create Idiom
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Avatar Section */}
          <div className="relative flex-shrink-0">
            <img
              src={userProfile.avatar || "/assets/image/avatar.jpg"}
              alt={userProfile.username}
              className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover transition-transform duration-300 transform hover:scale-105"
            />
            <div className="absolute bottom-1 right-1 bg-gradient-to-br from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              {userProfile.level}
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900 dark:text-gray-100">
              {userProfile.username}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg max-w-xl mx-auto md:mx-0">
              {userProfile.bio ||
                "Welcome to my idiom collection! Feel free to explore and learn."}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {myIdioms.length}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Idioms Created
                </span>
              </div>
              <div className="text-center">
                <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {new Date(userProfile.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Member Since
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
