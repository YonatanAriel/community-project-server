class GeminiPromptBuilder {
  static createMatchingPrompt(userQuery, matchingProfiles) {
    const profilesText = this.formatProfilesText(matchingProfiles);

    return `
You are an AI assistant that helps match people for professional networking and collaborations.

USER REQUEST: "${userQuery}"

AVAILABLE PROFILES:
${profilesText}

TASK: Analyze the user's request and recommend the most relevant user IDs from the available profiles.

INSTRUCTIONS:
1. Understand what the user is looking for (skills, location, industry, collaboration type)
2. Match the user's needs with the available profiles
3. Consider relevance factors like:
   - Skills alignment
   - Industry experience
   - Geographic proximity/preferences
   - Relevant interests
   - Job title relevance

RESPONSE FORMAT:
Return ONLY a JSON object with the following structure:
{
  "recommendedUserIds": [array of user_id numbers],
  "reasoning": "Brief explanation of why these users were selected"
}

IMPORTANT:
- Return only user IDs that exist in the provided profiles
- Rank by relevance (most relevant first)
- Include maximum 3 recommendations
- Return valid JSON format only
- No additional text or explanation outside the JSON

Example response:
{
  "recommendedUserIds": [12, 5, 8],
  "reasoning": "Selected users with relevant skills in fintech and full-stack development, with US market experience"
}
`;
  }

  static formatProfilesText(matchingProfiles) {
    return matchingProfiles
      .map((profile) => this.formatSingleProfile(profile))
      .join("\n");
  }

  static formatSingleProfile(profile) {
    return `ID: ${profile.user_id}
Name: ${profile.full_name}
Skills: ${this.formatArrayField(profile.skills)}
Interests: ${this.formatArrayField(profile.interests)}
Industries: ${this.formatArrayField(profile.industries)}
Job Titles: ${this.formatArrayField(profile.job_titles)}
Location: ${profile.location || "N/A"}
Summary: ${profile.summary || "N/A"}
Keywords: ${this.formatArrayField(profile.custom_keywords)}
---`;
  }

  static formatArrayField(field) {
    if (Array.isArray(field)) {
      return field.join(", ");
    }
    return field || "N/A";
  }
}

export default GeminiPromptBuilder;
