import { useState } from "react";
import { X, Save } from "lucide-react";
import { LabelText } from "../../component/label/LabelText";
import { LabelSelect } from "../../component/label/LabelSelect";
import { LabelTextArea } from "../../component/label/LabelTextarea";

interface EditIdiomModalProps {
  idiom: {
    _id: string;
    title: string;
    meaning: string;
    example: string;
    explanation: string;
    etymology: string;
    category: string;
    difficulty: string;
    tags: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => void;
}

export const EditIdiomModal = ({
  idiom,
  isOpen,
  onClose,
  onSave,
}: EditIdiomModalProps) => {
  const [formData, setFormData] = useState({
    title: idiom.title,
    meaning: idiom.meaning,
    example: idiom.example,
    explanation: idiom.explanation,
    etymology: idiom.etymology,
    category: idiom.category,
    difficulty: idiom.difficulty,
    tags: Array.isArray(idiom.tags) ? idiom.tags.join(", ") : "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert tags string back to array and clean up
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Only send the fields that can be updated
    const updatedData = {
      title: formData.title,
      meaning: formData.meaning,
      example: formData.example,
      explanation: formData.explanation,
      etymology: formData.etymology,
      category: formData.category,
      difficulty: formData.difficulty,
      tags: tagsArray,
    };

    onSave(updatedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Edit Idiom</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <LabelText
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          {/* Meaning */}
          <LabelTextArea
            label="Meaning"
            name="meaning"
            value={formData.meaning}
            onChange={handleInputChange}
            required
          />

          {/* Example */}
          <LabelTextArea
            label="Example"
            name="example"
            value={formData.example}
            onChange={handleInputChange}
            rows={2}
            required
          />

          {/* Explanation */}
          <LabelTextArea
            label="Explanation"
            name="explanation"
            value={formData.explanation}
            onChange={handleInputChange}
            rows={4}
            required
          />

          {/* Etymology */}
          <LabelTextArea
            label="Etymology"
            name="etymology"
            value={formData.etymology}
            onChange={handleInputChange}
            rows={3}
          />

          {/* Category and Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelSelect
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              options={[
                { value: "", label: "Select category" },
                { value: "General", label: "General" },
                { value: "Business", label: "Business" },
                { value: "Sports", label: "Sports" },
                { value: "Food", label: "Food" },
                { value: "Animals", label: "Animals" },
                { value: "Weather", label: "Weather" },
                { value: "Money", label: "Money" },
                { value: "Time", label: "Time" },
              ]}
            />

            <LabelSelect
              label="Difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              required
              options={[
                { value: "", label: "Select difficulty" },
                { value: "Beginner", label: "Beginner" },
                { value: "Intermediate", label: "Intermediate" },
                { value: "Advanced", label: "Advanced" },
              ]}
            />
          </div>

          {/* Tags */}
          <LabelText
            label={
              <>
                Tags{" "}
                <span className="text-gray-500 text-xs">
                  (separate by commas)
                </span>
              </>
            }
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g. common, useful, beginner"
          />

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
