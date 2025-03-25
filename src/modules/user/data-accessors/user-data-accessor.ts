import { Logger } from "../../../logger";
import UserAccountModel from "../models/user-account.model";

export default class UserDataAccessor {
  static async getUserAccountByEmail(email: string) {
    try {
      let userAccount = await UserAccountModel.findOne({
        where: {
          email: email,
        },
      });

      return userAccount?.dataValues;
    } catch (err: any) {
      Logger.ERROR(
        UserDataAccessor.name,
        UserDataAccessor.getUserAccountByEmail.name,
        err
      );
      throw err;
    }
  }

  static async getUserAccountByUsername(username: string) {
    try {
      let userAccount = await UserAccountModel.findOne({
        where: {
          username: username,
        },
      });

      return userAccount?.dataValues;
    } catch (err: any) {
      Logger.ERROR(
        UserDataAccessor.name,
        UserDataAccessor.getUserAccountByEmail.name,
        err
      );
      throw err;
    }
  }

  static getUserAccountByMobileNo(mobileNo: number) {
    try {
      let userAccount = UserAccountModel.findOne({
        where: {
          mobile_no: mobileNo,
        },
      });

      return userAccount;
    } catch (err: any) {
      Logger.ERROR(
        UserDataAccessor.name,
        UserDataAccessor.getUserAccountByEmail.name,
        err
      );
      throw err;
    }
  }
}
