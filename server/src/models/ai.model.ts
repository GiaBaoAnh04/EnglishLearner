import { callOpenAIAPI } from "../services/ai.service";

interface GeneratedIdiomData {
  title: string;
  meaning: string;
  example: string;
  explanation: string;
  etymology?: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags?: string[];
}

export const generateIdiomData = async (
  title: string
): Promise<GeneratedIdiomData> => {
  try {
    const prompt = `Given the idiom "${title}", generate a complete data in JSON format with these fields:
    - meaning (1-2 sentences)
    - example (example sentence)
    - explanation (origin/meaning explanation)
    - etymology (optional, if known)
    - category (e.g., Animals, Nature, Food)
    - difficulty (Beginner, Intermediate, Advanced)
    - tags (array of relevant tags)
    
    Return valid JSON only. Example:
    {
      "meaning": "...",
      "example": "...",
      "explanation": "...",
      "etymology": "...",
      "category": "Animals",
      "difficulty": "Intermediate",
      "tags": ["animal", "behavior"]
    }`;

    const response = await callOpenAIAPI(prompt);
    const data = JSON.parse(response);

    // Validate and set default values
    return {
      title,
      meaning: data.meaning || "No meaning generated",
      example: data.example || "No example generated",
      explanation: data.explanation || "No explanation generated",
      etymology: data.etymology || "",
      category: data.category || "General",
      difficulty: ["Beginner", "Intermediate", "Advanced"].includes(
        data.difficulty
      )
        ? data.difficulty
        : "Intermediate",
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  } catch (error) {
    console.error("AI Model Generation Error:", error);
    throw new Error("Failed to generate idiom data");
  }
};
