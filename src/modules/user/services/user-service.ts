import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserAccountModel from "../models/user-account.model";
import { Logger } from "../../../logger";
import RoleModel from "../models/role.model";
export default class UserService {
  static LOGGER_NAME = "UserService";
  static async createUserAccount(userDetails: UserAccountModel) {
    try {
      let result = await UserAccountModel.create(userDetails.dataValues);
      return result.dataValues;
    } catch (error: any) {
      Logger.ERROR(UserService.name, UserService.createUserAccount.name, error);
      throw error;
    }
  }

  static async authenticateUser(userCred: UserAccountModel) {
    try {
      let result = await UserAccountModel.findOne({
        where: {
          username: userCred.username,
        },
      });
      if (result) {
        const res = bcrypt.compareSync(userCred.password, result?.password);
        if (res) {
          // Generate JWT Token
          const user_data = {
            user_id: result.id,
            username: result.username,
            current_role: result.current_role,
            email: result.email,
            mobile_no: result.mobile_no,
          };
          const user_token = jwt.sign(
            user_data,
            process.env.TOKEN_KEY as string,
            {
              algorithm: "HS256",
              expiresIn: "7d",
            }
          );
          return { token: user_token, username: result.username };
        } else {
          throw `Incorrect password, forgot password ?`;
        }
      } else {
        throw `User ${userCred.username} does not exist`;
      }
    } catch (error: any) {
      Logger.ERROR(UserService.name, UserService.authenticateUser.name, error);
      throw error;
    }
  }
}
