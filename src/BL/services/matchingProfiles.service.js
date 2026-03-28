import MatchingProfilesController from "../../DL/controllers/matchingProfiles.controller.js";

class MatchingProfilesService {
  static async getProfilesForMatching(limit = 5) {
    try {
      const query = `SELECT * FROM matching_profiles LIMIT ${limit}`;
      const profiles = MatchingProfilesController.read(query);

      if (!profiles || profiles.length === 0) {
        throw new Error("No matching profiles found");
      }

      return profiles;
    } catch (error) {
      console.error("Error fetching matching profiles:", error);
      throw error;
    }
  }

  static validateProfiles(profiles) {
    if (!Array.isArray(profiles) || profiles.length === 0) {
      return false;
    }

    return profiles.every((profile) => profile.user_id && profile.full_name);
  }
}

export default MatchingProfilesService;
