import GeminiApiService from "./geminiApi.service.js";
import MatchingProfilesService from "./matchingProfiles.service.js";
import GeminiPromptBuilder from "../utils/geminiPromptBuilder.js";
import GeminiResponseParser from "../utils/geminiResponseParser.js";

class GeminiService {
  static async getRecommendations(userQuery) {
    try {
      if (!GeminiApiService.isConfigured()) {
        return { error: "Gemini API key is not configured" };
      }

      const matchingProfiles =
        await MatchingProfilesService.getProfilesForMatching(5);

      if (!MatchingProfilesService.validateProfiles(matchingProfiles)) {
        return { error: "No valid matching profiles found" };
      }

      const prompt = GeminiPromptBuilder.createMatchingPrompt(
        userQuery,
        matchingProfiles
      );

      const apiService = new GeminiApiService();
      const responseText = await apiService.generateContent(prompt);

      const userIds = GeminiResponseParser.parseUserIds(responseText);

      return {
        userIds,
        rawResponse: responseText,
      };
    } catch (error) {
      console.error("Error in Gemini service:", error);
      return { error: "Failed to get AI recommendations" };
    }
  }
}

export default GeminiService;
