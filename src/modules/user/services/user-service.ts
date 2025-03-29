import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  IUserAccountModel,
  UserAccountModel,
} from "../models/user-account.model";
import { Logger } from "../../../logger";

export default class UserService {
  static LOGGER_NAME = "UserService";
  static async createUserAccount(userDetails: IUserAccountModel) {
    try {
      let result = await UserAccountModel.create(userDetails as any);
      return result.toJSON();
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
      let userAccount = result?.toJSON();
      if (userAccount) {
        const res = bcrypt.compareSync(
          userCred.password,
          userAccount?.password
        );
        if (res) {
          // Generate JWT Token
          const user_data = {
            user_id: userAccount.id,
            username: userAccount.username,
            current_role: userAccount.current_role,
            email: userAccount.email,
            mobile_no: userAccount.mobile_no,
          };
          const user_token = jwt.sign(
            user_data,
            process.env.TOKEN_KEY as string,
            {
              algorithm: "HS256",
              expiresIn: "7d",
            }
          );
          return { token: user_token, username: userAccount.username };
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
