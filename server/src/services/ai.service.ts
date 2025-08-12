// src/services/aiService.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { config } from "../config/ai";

interface OpenAIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  response_format?: { type: "text" | "json_object" };
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const callOpenAIAPI = async (prompt: string): Promise<string> => {
  const requestData: OpenAIRequest = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  };

  const options: AxiosRequestConfig = {
    method: "POST",
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${config.openAIKey}`,
      "Content-Type": "application/json",
    },
    data: requestData,
  };

  try {
    const response: AxiosResponse<OpenAIResponse> = await axios(options);
    return response.data.choices[0].message.content;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "OpenAI API Error:",
      axiosError.response?.data || axiosError.message
    );
    throw new Error("Failed to get response from AI service");
  }
};
