class GeminiResponseParser {
  static parseUserIds(responseText) {
    console.log(" Gemini Response:", responseText);

    try {
      const cleanText = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const parsed = JSON.parse(cleanText);

      if (
        parsed.recommendedUserIds &&
        Array.isArray(parsed.recommendedUserIds)
      ) {
        return parsed.recommendedUserIds.map((id) => parseInt(id));
      }

      return [];
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.error("Raw response:", responseText);

      return this.extractNumbersFallback(responseText);
    }
  }

  static extractNumbersFallback(responseText) {
    const numberMatches = responseText.match(/\d+/g);
    if (numberMatches) {
      return numberMatches.slice(0, 3).map((id) => parseInt(id));
    }
    return [];
  }
}

export default GeminiResponseParser;
