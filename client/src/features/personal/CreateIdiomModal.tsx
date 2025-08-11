import React, { Dispatch, SetStateAction } from "react";
import { NewIdiomData } from "../../types/idiom";

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
  const onClose = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-bold mb-4">Create New Idiom</h3>

        {/* Title Input */}
        <input
          type="text"
          value={newIdiomData.title}
          onChange={(e) =>
            setNewIdiomData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Title"
          className="border rounded p-2 w-full mb-3"
        />

        {/* Category Input */}
        <input
          type="text"
          value={newIdiomData.category}
          onChange={(e) =>
            setNewIdiomData((prev) => ({ ...prev, category: e.target.value }))
          }
          placeholder="Category"
          className="border rounded p-2 w-full mb-3"
        />

        {/* Meaning Textarea */}
        <textarea
          value={newIdiomData.meaning}
          onChange={(e) =>
            setNewIdiomData((prev) => ({ ...prev, meaning: e.target.value }))
          }
          placeholder="Meaning"
          className="border rounded p-2 w-full mb-3"
        />

        {/* Example Textarea */}
        <textarea
          value={newIdiomData.example}
          onChange={(e) =>
            setNewIdiomData((prev) => ({ ...prev, example: e.target.value }))
          }
          placeholder="Example"
          className="border rounded p-2 w-full mb-3"
        />

        {/* Explanation Textarea */}
        <textarea
          value={newIdiomData.explanation}
          onChange={(e) =>
            setNewIdiomData((prev) => ({
              ...prev,
              explanation: e.target.value,
            }))
          }
          placeholder="Explanation"
          className="border rounded p-2 w-full mb-3"
        />

        {/* Difficulty Select */}
        <select
          value={newIdiomData.difficulty}
          onChange={(e) =>
            setNewIdiomData((prev) => ({ ...prev, difficulty: e.target.value }))
          }
          className="border rounded p-2 w-full mb-3"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCreateIdiom}
            // Update disabled condition to include the new 'category' field
            disabled={
              !newIdiomData.title ||
              !newIdiomData.category ||
              !newIdiomData.meaning ||
              !newIdiomData.example ||
              !newIdiomData.explanation ||
              !newIdiomData.difficulty
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
