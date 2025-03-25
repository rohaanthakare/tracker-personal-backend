import * as bcrypt from "bcrypt";
import { Logger } from "../../../logger";
import UserDataAccessor from "../data-accessors/user-data-accessor";
import UserAccountModel from "../models/user-account.model";
import RoleDataAccessor from "../data-accessors/role-data-accessor";

export default class UserWorkflows {
  static async registerUserWorkflow(userDetails: any) {
    try {
      // Check for duplicate username
      let userAccount = await UserDataAccessor.getUserAccountByUsername(
        userDetails.username
      );
      if (userAccount) {
        throw `Username already exists`;
      }

      userAccount = await UserDataAccessor.getUserAccountByEmail(
        userDetails.email
      );
      if (userAccount) {
        throw `Email already exists`;
      }

      userAccount = await UserDataAccessor.getUserAccountByMobileNo(
        userDetails.mobile_no
      );
      if (userAccount) {
        throw `Mobile No. already exists`;
      }
      userDetails.password = bcrypt.hashSync(userDetails.password, 10);
      let roleDetails = await RoleDataAccessor.getRoleByRoleCode(
        "TRACKER_USER"
      );
      userDetails.current_role = roleDetails.id;
      let newUserAccount: any = await UserAccountModel.create(userDetails);
      newUserAccount = newUserAccount?.dataValues;
      delete newUserAccount.password;
      return newUserAccount;
    } catch (err: any) {
      Logger.ERROR(
        UserWorkflows.name,
        UserWorkflows.registerUserWorkflow.name,
        err
      );
      throw err;
    }
  }
}
