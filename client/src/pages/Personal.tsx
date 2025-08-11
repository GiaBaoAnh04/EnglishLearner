import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../component/search-bar/search-bar";
import { SelectInput } from "../component/select-input/select-input";
import { idiomApi } from "../api/idiomApi";
import { userApi } from "../api/userApi";
import { Idiom, NewIdiomData } from "../types/idiom";
import CreateIdiomModal from "../features/personal/CreateIdiomModal";
import EditProfileForm from "../features/personal/EditProfileForm";
import IdiomsGrid from "../features/personal/IdiomsGrid";
import ProfileHeader from "../features/personal/ProfileHeader";
import ProfileTabs from "../features/personal/ProfileTabs";

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

const PersonalPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [myIdioms, setMyIdioms] = useState<Idiom[]>([]);
  const [likedIdioms, setLikedIdioms] = useState<Idiom[]>([]);
  const [activeTab, setActiveTab] = useState<"my-idioms" | "liked-idioms">(
    "my-idioms"
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "mostCommented">(
    "newest"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [editProfile, setEditProfile] = useState({
    username: "",
    bio: "",
    avatar: "",
  });

  //   const [newIdiom, setNewIdiom] = useState({
  //     title: "",
  //     meaning: "",
  //     example: "",
  //     explanation: "",
  //     category: "",
  //     difficulty: "Beginner",
  //   });

  const [newIdiomData, setNewIdiomData] = useState<NewIdiomData>({
    title: "",
    meaning: "",
    example: "",
    explanation: "",
    etymology: "",
    category: "",
    difficulty: "Beginner",
    tags: [],
  });

  useEffect(() => {
    if (!token) return;

    Promise.all([
      userApi.getProfile(token),
      idiomApi.getUserIdioms(token),
      userApi.getFavouriteIdioms(token),
    ])
      .then(([profileRes, myIdiomsRes, likedRes]) => {
        const profile = profileRes.data.data.user;
        setUserProfile(profile);
        setEditProfile({
          username: profile.username,
          bio: profile.bio || "",
          avatar: profile.avatar || "/assets/image/avatar.jpg",
        });

        setMyIdioms(myIdiomsRes.data.data || []);
        setLikedIdioms(likedRes.data.data || []);
      })
      .catch((err) => {
        console.error("Error loading profile data:", err);
      });
  }, [token]);

  const handleSaveProfile = useCallback(async () => {
    if (!token) return;
    try {
      await userApi.updateProfile(editProfile, token);
      setUserProfile((prev) => (prev ? { ...prev, ...editProfile } : null));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [editProfile, token]);

  const handleCreateIdiom = useCallback(async () => {
    if (!token) return;
    try {
      // Fix: Change 'newIdiom' to 'newIdiomData'
      const res = await idiomApi.createIdiom(newIdiomData, token);
      setMyIdioms((prev) => [res.data, ...prev]);
      setShowCreateModal(false);
      // Fix: Change 'newIdiom' to 'newIdiomData' in the reset state
      setNewIdiomData({
        title: "",
        meaning: "",
        example: "",
        explanation: "",
        etymology: "",
        category: "",
        difficulty: "Beginner",
        tags: [],
      });
    } catch (error) {
      console.error("Error creating idiom:", error);
    }
  }, [newIdiomData, token]); // Fix: Change 'newIdiom' to 'newIdiomData'

  const handleIdiomClick = (id: string) => {
    navigate(`/idiom-detail/${id}`);
  };

  const currentIdioms = activeTab === "my-idioms" ? myIdioms : likedIdioms;

  const filteredIdioms = currentIdioms
    .filter(
      (idiom) =>
        idiom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idiom.meaning.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "popular") {
        return b.votes.length - a.votes.length;
      }
      if (sortBy === "mostCommented") {
        return b.comments.length - a.comments.length;
      }
      return 0;
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
      <ProfileHeader
        userProfile={userProfile}
        myIdioms={myIdioms}
        isEditing={isEditing}
        onEdit={() => setIsEditing((prev) => !prev)}
        onCreate={() => setShowCreateModal(true)}
      />

      {isEditing && (
        <EditProfileForm
          editProfile={editProfile}
          setEditProfile={setEditProfile}
          handleSaveProfile={handleSaveProfile}
          setIsEditing={setIsEditing}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <ProfileTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="bg-white rounded-lgc shadow-md p-4 mb-6">
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
                setSortBy((option?.value as typeof sortBy) || "newest")
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

        <IdiomsGrid
          idioms={filteredIdioms}
          activeTab={activeTab}
          onClickIdiom={handleIdiomClick}
        />
      </div>

      {showCreateModal && (
        <CreateIdiomModal
          newIdiomData={newIdiomData}
          setNewIdiomData={setNewIdiomData}
          handleCreateIdiom={handleCreateIdiom}
          setShowCreateModal={setShowCreateModal}
        />
      )}
    </div>
  );
};

export default PersonalPage;
