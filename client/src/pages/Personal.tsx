import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../component/search-bar/search-bar";
import { SelectInput } from "../component/select-input/select-input";
import { IdiomCard } from "../features/home/EdiomCard";
import { idiomApi } from "../api/idiomApi";
import { userApi } from "../api/userApi";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedAt: string;
  createdAt: string;
  totalIdioms: number;
  totalLikes: number;
  level: string;
}

interface Idiom {
  id: number;
  title: string;
  meaning: string;
  example: string;
  explanation: string;
  difficulty: string;
  votes: any[];
  comments: any[];
  createdAt: string;
  author: {
    fullName: string;
  };
  category: string;
  isLiked?: boolean;
}

const PersonalPage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("my-idioms");
  const [myIdioms, setMyIdioms] = useState<Idiom[]>([]);
  const [likedIdioms, setLikedIdioms] = useState<Idiom[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProfile, setEditProfile] = useState({
    username: "",
    bio: "",
    avatar: "",
  });
  const [newIdiom, setNewIdiom] = useState({
    title: "",
    meaning: "",
    example: "",
    explanation: "",
    category: "",
    difficulty: "Beginner",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // hoặc lấy từ context

    if (!token) return;

    // Load user profile
    userApi.getProfile(token).then((res) => {
      const profile = res.data.data.user;
      console.log(profile, "profile");
      setUserProfile(profile);
      setEditProfile({
        username: profile.username,
        bio: profile.bio || "",
        avatar: profile.avatar || "/assets/image/avatar.jpg",
      });
    });

    // Load user's idioms
    idiomApi.getUserIdioms(token).then((res) => {
      console.log(res.data.data, "res.data.data");
      setMyIdioms(res.data.data || []);
    });

    // Load liked idioms
    userApi.getFavouriteIdioms(token).then((res) => {
      setLikedIdioms(res.data.data || []);
    });
  }, []);

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token"); // hoặc lấy từ context

    if (!token) return;
    try {
      await userApi.updateProfile(editProfile, token);
      setUserProfile((prev) => (prev ? { ...prev, ...editProfile } : null));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCreateIdiom = async () => {
    const token = localStorage.getItem("token"); // hoặc lấy từ context

    if (!token) return;
    try {
      const response = await idiomApi.createIdiom(newIdiom, token);
      setMyIdioms((prev) => [response.data, ...prev]);
      setShowCreateModal(false);
      setNewIdiom({
        title: "",
        meaning: "",
        example: "",
        explanation: "",
        category: "",
        difficulty: "Beginner",
      });
    } catch (error) {
      console.error("Error creating idiom:", error);
    }
  };

  const handleIdiomClick = (id: number) => {
    navigate(`/idiom-detail/${id}`);
  };

  const currentIdioms = activeTab === "my-idioms" ? myIdioms : likedIdioms;

  const filteredIdioms = currentIdioms
    .filter((idiom) => {
      return (
        idiom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idiom.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "popular":
          return b.votes.length - a.votes.length;
        case "mostCommented":
          return b.comments.length - a.comments.length;
        default:
          return 0;
      }
    });

  const tabs = [
    { id: "my-idioms", label: "My Idioms", count: myIdioms.length },
    { id: "liked-idioms", label: "Liked Idioms", count: likedIdioms.length },
  ];

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
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
                  <span className="font-semibold text-lg">
                    {myIdioms.length}
                  </span>
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
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-medium"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                Create Idiom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={editProfile.avatar}
                  onChange={(e) =>
                    setEditProfile((prev) => ({
                      ...prev,
                      avatar: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar
              placeholder="Search your idioms..."
              value={searchTerm}
              onChange={setSearchTerm}
              fullWidth
              clearable
              dropdownVisible={false}
              containerClassName="flex-1"
            />
            <SelectInput
              value={sortBy}
              onChange={(option) =>
                setSortBy((option?.value as string) || "newest")
              }
              options={[
                { label: "Newest", value: "newest" },
                { label: "Most Popular", value: "popular" },
                { label: "Most Commented", value: "mostCommented" },
              ]}
              placeholder="Sort by"
              className="min-w-[180px]"
            />
          </div>
        </div>

        {/* Idioms Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIdioms.map((idiom) => (
            <div key={idiom.id} className="relative">
              <IdiomCard
                idiom={idiom}
                className="hover:shadow-lg transition-shadow"
                onClick={() => handleIdiomClick(idiom.id)}
              />
            </div>
          ))}
        </div>

        {filteredIdioms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {activeTab === "my-idioms"
                ? "No idioms created yet"
                : "No liked idioms yet"}
            </div>
            <p className="text-gray-400">
              {activeTab === "my-idioms"
                ? "Start creating your first idiom!"
                : "Start exploring and like some idioms!"}
            </p>
          </div>
        )}
      </div>

      {/* Create Idiom Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Create New Idiom</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newIdiom.title}
                    onChange={(e) =>
                      setNewIdiom((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter idiom title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meaning *
                  </label>
                  <textarea
                    value={newIdiom.meaning}
                    onChange={(e) =>
                      setNewIdiom((prev) => ({
                        ...prev,
                        meaning: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain what this idiom means"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Example *
                  </label>
                  <textarea
                    value={newIdiom.example}
                    onChange={(e) =>
                      setNewIdiom((prev) => ({
                        ...prev,
                        example: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide an example sentence using this idiom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Explanation *
                  </label>
                  <textarea
                    value={newIdiom.explanation}
                    onChange={(e) =>
                      setNewIdiom((prev) => ({
                        ...prev,
                        explanation: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed explanation of the idiom"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newIdiom.category}
                      onChange={(e) =>
                        setNewIdiom((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Animals, Food, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Difficulty
                    </label>
                    <select
                      value={newIdiom.difficulty}
                      onChange={(e) =>
                        setNewIdiom((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Easy">Beginner</option>
                      <option value="Medium">Intermediate</option>
                      <option value="Hard">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Example Usage
                  </label>
                  <textarea
                    value={newIdiom.example}
                    onChange={(e) =>
                      setNewIdiom((prev) => ({
                        ...prev,
                        example: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Show how to use this idiom in a sentence"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Etymology (Optional)
                  </label>
                  <textarea
                    value={newIdiom.title}
                    onChange={(e) =>
                      setNewIdiom((prev) => ({
                        ...prev,
                        etymology: e.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Origin or history of this idiom"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateIdiom}
                  disabled={
                    !newIdiom.title ||
                    !newIdiom.meaning ||
                    !newIdiom.example ||
                    !newIdiom.explanation
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Create Idiom
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalPage;
