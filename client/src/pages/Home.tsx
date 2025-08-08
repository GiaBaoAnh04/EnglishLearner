import { useState, useEffect } from "react";
import { categories, difficulties, dummyIdioms } from "../dummy/dummyIdioms";
import Header from "../features/home/Header";
import { SearchBar } from "../component/search-bar/search-bar";
import { SelectInput } from "../component/select-input/select-input";
import { IdiomCard } from "../features/home/EdiomCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [idioms, setIdioms] = useState(dummyIdioms);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  // Thêm hàm này vào component Home
  const handleIdiomClick = (id: number) => {
    navigate(`/idiom-detail/${id}`);
  };

  // Filter and sort idioms
  useEffect(() => {
    let filtered = dummyIdioms.filter((idiom) => {
      const matchesSearch =
        idiom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idiom.meaning.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || idiom.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All" || idiom.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "popular":
          return b.votes - a.votes;
        case "mostCommented":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

    setIdioms(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Search and Filters */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <SearchBar
              placeholder="Search idioms..."
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              fullWidth
              clearable
              dropdownVisible={false}
              inputClassName="pl-10"
              containerClassName="flex-1"
            />

            {/* Category Filter */}
            <SelectInput
              value={selectedCategory}
              onChange={(option) =>
                setSelectedCategory(option?.value as string)
              }
              options={categories.map((category) => ({
                label: category,
                value: category,
              }))}
              placeholder="Select category"
              arrow
              clearable
            />

            {/* Difficulty Filter */}
            <SelectInput
              value={selectedDifficulty}
              onChange={(option) =>
                setSelectedDifficulty((option?.value as string) || "")
              }
              options={difficulties.map((difficulty) => ({
                label: difficulty,
                value: difficulty,
              }))}
              placeholder="Select difficulty"
              className="min-w-[180px]"
              inputClassName="border-gray-300 focus:ring-2 focus:ring-blue-500"
              dropdownClassName="border-gray-300 shadow-lg"
            />

            {/* Sort */}
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
              inputClassName="border-gray-300 focus:ring-2 focus:ring-blue-500"
              dropdownClassName="border-gray-300 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Idioms Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {idioms.map((idiom) => (
            <IdiomCard
              key={idiom.id}
              idiom={idiom}
              className="hover:shadow-md" // Có thể thêm class tùy chỉnh
              onClick={handleIdiomClick} // Optional: có thể bỏ qua để dùng navigate mặc định
            />
          ))}
        </div>

        {idioms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">No idioms found</div>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
