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
