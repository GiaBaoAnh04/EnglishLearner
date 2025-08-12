// controllers/aiController.ts
import { Request, Response } from "express";
import axios from "axios";

export const generateIdiomData = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const prompt = `
      Dựa trên idiom: "${title}", hãy trả về dữ liệu dưới dạng JSON thuần theo format:
      {
        "category": "string",
        "meaning": "string",
        "example": "string",
        "explanation": "string",
        "etymology": "string",
        "difficulty": "Beginner|Intermediate|Advanced",
        "tags": ["string", "string"]
      }
      Chỉ trả về JSON hợp lệ, không kèm giải thích hay văn bản khác.
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        messages: [
          { role: "system", content: "Bạn là một API trả về JSON thuần." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "English Learner App",
        },
      }
    );

    let rawContent = response.data?.choices?.[0]?.message?.content?.trim();

    if (!rawContent) {
      return res.status(500).json({ error: "No content returned from AI" });
    }

    // Xử lý nếu AI trả về kèm ```json``` hoặc ```
    if (rawContent.startsWith("```")) {
      rawContent = rawContent.replace(/```json|```/g, "").trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawContent);
    } catch (err) {
      return res.status(500).json({
        error: "Invalid JSON returned from AI",
        raw: rawContent,
      });
    }

    res.json({ data: parsedData });
  } catch (error: any) {
    console.error(
      "Error generating idiom:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to generate idiom data",
      details: error.response?.data || error.message,
    });
  }
};
