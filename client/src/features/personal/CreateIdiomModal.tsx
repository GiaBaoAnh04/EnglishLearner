import React, { Dispatch, SetStateAction, useState } from "react";
import { NewIdiomData } from "../../types/idiom";
import { aiApi } from "../../api/aiApi";

interface CreateIdiomModalProps {
  newIdiomData: NewIdiomData;
  setNewIdiomData: Dispatch<SetStateAction<NewIdiomData>>;
  handleCreateIdiom: () => void;
  setShowCreateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateIdiomModal({
  newIdiomData,
  setNewIdiomData,
  handleCreateIdiom,
  setShowCreateModal,
}: CreateIdiomModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const onClose = () => {
    setShowCreateModal(false);
  };

  const handleManualChange =
    (field: keyof NewIdiomData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setNewIdiomData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleGenerate = async () => {
    if (!newIdiomData.title.trim()) {
      setGenerationError("Please enter a title before generating.");
      return;
    }

    setIsGenerating(true);
    setGenerationError("");

    try {
      const aiResult = await aiApi.generateIdiomData(newIdiomData.title);
      console.log(aiResult, "aiResult");
      setNewIdiomData((prev) => ({
        ...prev,
        ...aiResult, // Gộp dữ liệu AI trả về
      }));
    } catch (error) {
      console.error(error);
      setGenerationError("Failed to generate idiom data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">Create New Idiom</h3>

        {/* Title Input */}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newIdiomData.title}
            onChange={handleManualChange("title")}
            placeholder="Enter idiom title"
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>

        {generationError && (
          <div className="text-red-500 text-sm mb-3">{generationError}</div>
        )}

        {/* Category Input */}
        <input
          type="text"
          value={newIdiomData.category}
          onChange={handleManualChange("category")}
          placeholder="Category"
          className="border rounded p-2 w-full mb-3"
        />

        {/* Meaning Textarea */}
        <textarea
          value={newIdiomData.meaning}
          onChange={handleManualChange("meaning")}
          placeholder="Meaning"
          className="border rounded p-2 w-full mb-3"
          rows={3}
        />

        {/* Example Textarea */}
        <textarea
          value={newIdiomData.example}
          onChange={handleManualChange("example")}
          placeholder="Example sentence"
          className="border rounded p-2 w-full mb-3"
          rows={3}
        />

        {/* Explanation Textarea */}
        <textarea
          value={newIdiomData.explanation}
          onChange={handleManualChange("explanation")}
          placeholder="Detailed explanation"
          className="border rounded p-2 w-full mb-3"
          rows={3}
        />

        {/* Etymology Input */}
        <input
          type="text"
          value={newIdiomData.etymology}
          onChange={handleManualChange("etymology")}
          placeholder="Etymology (origin)"
          className="border rounded p-2 w-full mb-3"
        />

        {/* Difficulty Select */}
        <select
          value={newIdiomData.difficulty}
          onChange={handleManualChange("difficulty")}
          className="border rounded p-2 w-full mb-3"
        >
          <option value="">Select difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        {/* Tags Input */}
        <input
          type="text"
          value={newIdiomData.tags?.join(", ") || ""}
          onChange={(e) => {
            setNewIdiomData((prev) => ({
              ...prev,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            }));
          }}
          placeholder="Tags (comma separated)"
          className="border rounded p-2 w-full mb-3"
        />

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCreateIdiom}
            disabled={
              !newIdiomData.title ||
              !newIdiomData.category ||
              !newIdiomData.meaning ||
              !newIdiomData.example ||
              !newIdiomData.explanation ||
              !newIdiomData.difficulty ||
              isGenerating
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300"
          >
            Create Idiom
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
