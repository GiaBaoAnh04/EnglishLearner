import { useState, useEffect } from "react";
import { difficulties } from "../dummy/dummyIdioms"; // vẫn có thể giữ difficulties mock
import Header from "../features/home/Header";
import { SearchBar } from "../component/search-bar/search-bar";
import { SelectInput } from "../component/select-input/select-input";
import { IdiomCard } from "../features/home/EdiomCard";
import { useNavigate } from "react-router-dom";
import { idiomApi } from "../api/idiomApi";

const Home = () => {
  const [idioms, setIdioms] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const handleIdiomClick = (id: string) => {
    navigate(`/idiom-detail/${id}`);
  };

  useEffect(() => {
    // Gọi API lấy idioms
    idiomApi.getAllIdioms().then((res) => {
      setIdioms(res.data); // tùy backend trả
    });

    // Gọi API lấy categories
    idiomApi.getAllCategories().then((res) => {
      setCategories(["All", ...res.data.data]); // thêm "All" vào đầu
    });
  }, []);

  // Filter và sort (trên data thật)
  const filteredIdioms = idioms
    .filter((idiom) => {
      const matchesSearch =
        idiom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idiom.meaning.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || idiom.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All" || idiom.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <SearchBar
              placeholder="Search idioms..."
              value={searchTerm}
              onChange={setSearchTerm}
              fullWidth
              clearable
              dropdownVisible={false}
              inputClassName="pl-10"
              containerClassName="flex-1"
            />
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
      </div>
      <div className="container mx-auto px-4 pb-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIdioms.map((idiom) => (
            <IdiomCard
              key={idiom._id}
              idiom={idiom}
              className="hover:shadow-md"
              onClick={() => handleIdiomClick(idiom._id)}
            />
          ))}
        </div>
        {filteredIdioms.length === 0 && (
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
