import UsersController from "../../DL/controllers/user.controller.js";
import MatchingProfilesController from "../../DL/controllers/matchingProfiles.controller.js";

class RecommendationBuilder {
  static async buildRecommendations(userIds) {
    const recommendations = [];

    for (const userId of userIds) {
      try {
        const user = UsersController.readOne("id", userId);
        const profile = MatchingProfilesController.readOne("user_id", userId);

        if (user) {
          const recommendation = this.buildSingleRecommendation(user, profile);
          recommendations.push(recommendation);
        }
      } catch (error) {
        console.error(`Error fetching details for user ${userId}:`, error);
      }
    }

    return recommendations;
  }

  static buildSingleRecommendation(user, profile) {
    return {
      id: user.id.toString(),
      user_name: user.full_name || "Unknown User",
      email: user.email || "",
      profile_picture: user.profile_image_url || "",
      job_title: profile?.job_titles?.[0] || "",
      company: "",
      location: profile?.location || "",
      bio: profile?.summary || "",
      skills: profile?.skills || [],
      industries: profile?.industries || [],
      interests: profile?.interests || [],
      matchScore: 0.85,
      matchReason:
        "Selected based on relevant skills and experience matching your requirements",
    };
  }
}

export default RecommendationBuilder;
