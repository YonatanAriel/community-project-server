import UsersController from "../../DL/controllers/user.controller.js";
import { comparePasswords, createToken } from "../utils/auth.js";

class UsersServices {
  static getAllUsers = () => {
    const allUsers = UsersController.read();
    return allUsers;
  };

  static getUserById = (id) => {
    const user = UsersController.readOne("id", id);
    return user;
  };

  static getUserByEmail = (email) => {
    const user = UsersController.readOne("email", email);
    return user;
  };

  static getUserProfiles = () => {
    const query = `
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.profile_image_url,
        mp.skills,
        mp.interests,
        mp.job_titles,
        mp.industries,
        mp.summary
      FROM users u
      LEFT JOIN matching_profiles mp ON u.id = mp.user_id
      WHERE mp.user_id IS NOT NULL
    `;

    const profiles = UsersController.readWithParams(query, []);

    return profiles.map((profile) => ({
      id: profile.id,
      user_name: profile.full_name,
      email: profile.email,
      photo_url: profile.profile_image_url,
      skills: profile.skills ? JSON.parse(profile.skills) : [],
      interests: profile.interests ? JSON.parse(profile.interests) : [],
      job_titles: profile.job_titles ? JSON.parse(profile.job_titles) : [],
      industries: profile.industries ? JSON.parse(profile.industries) : [],
      summary: profile.summary || "",
    }));
  };

  static signIn = (data) => {
    try {
      if (!data.email || !data.password) {
        return { error: "Email and password are required" };
      }

      const user = this.getUserByEmail(data.email);
      if (!user || !user.password) return { error: "Wrong email or password" };

      const isPasswordMatch = comparePasswords(data.password, user.password);
      if (!isPasswordMatch) return { error: "Wrong email or password" };

      const token = createToken({
        id: user.id,
        email: user.email,
        is_admin: user.is_admin,
      });
      return {
        token,
        userId: user.id,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          is_admin: user.is_admin,
        },
      };
    } catch (error) {
      console.log(error);
      return { error: "Server error" };
    }
  };
}

export default UsersServices;
