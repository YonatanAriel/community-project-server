import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiApiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash",
    });
  }

  async generateContent(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw new Error("Failed to generate content from Gemini API");
    }
  }

  static isConfigured() {
    return !!process.env.GEMINI_API_KEY;
  }
}

export default GeminiApiService;
