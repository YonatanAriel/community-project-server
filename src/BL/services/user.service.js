import UsersController from "../../DL/controllers/user.controller.js";
import {
  comparePasswords,
  createToken,
  encryptPassword,
} from "../utils/auth.js";

class UsersServices {
  static getAllUsers = () => {
    const allUsers = UsersController.read();
    return allUsers;
  };

  static getUserById = (id) => {
    const user = UsersController.readOne("id", id);
    return user;
  };

  static getUserByUserName = (userName) => {
    const user = UsersController.readOne("user_name", userName);
    return user;
  };

  static signIn = (data) => {
    try {
      if (!data.userName || !data.password) return { error: "Missing data" };
      const user = this.getUserByUserName(data.userName);

      if (!user || !user.password)
        return { error: "Wrong username or password" };

      const isPasswordMatch = comparePasswords(data.password, user.password);
      if (!isPasswordMatch) return { error: "Wrong username or password" };

      const userId = user?.id;
      const token = createToken({ userName: data.userName });
      return { token, userId };
    } catch (error) {
      console.log(error);
    }
  };

  static async signUp(data, photoPath) {
    try {
      if (!data.userName || !data.password || !data.clientId)
        return { error: "Missing data" };

      const isUserNameTaken = this.getUserByUserName(data.userName);
      if (isUserNameTaken) return { error: "User name already taken" };

      const hashedPassword = encryptPassword(data.password);
      data.password = hashedPassword;

      const userId = UsersController.create(data);
      if (!userId) return { error: "Error in creating user" };

      const token = createToken({ userName: data.userName });
      return { token, userId };
    } catch (err) {
      console.log(err);
    }
  }
}

export default UsersServices;
