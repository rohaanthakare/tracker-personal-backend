import * as bcrypt from "bcrypt";
import { Logger } from "../../../logger";
import UserDataAccessor from "../data-accessors/user-data-accessor";
import {
  IUserAccountModel,
  UserAccountModel,
} from "../models/user-account.model";
import RoleDataAccessor from "../data-accessors/role-data-accessor";

export default class UserWorkflows {
  static async registerUserWorkflow(userDetails: IUserAccountModel) {
    try {
      // Check for duplicate username
      let userAccount = await UserDataAccessor.getUserAccountByUsername(
        userDetails.username as string
      );
      if (userAccount) {
        throw `Username already exists`;
      }

      userAccount = await UserDataAccessor.getUserAccountByEmail(
        userDetails.email as string
      );
      if (userAccount) {
        throw `Email already exists`;
      }

      userAccount = await UserDataAccessor.getUserAccountByMobileNo(
        userDetails.mobile_no as number
      );
      if (userAccount) {
        throw `Mobile No. already exists`;
      }
      userDetails.password = bcrypt.hashSync(
        userDetails.password as string,
        10
      );
      let roleDetails = await RoleDataAccessor.getRoleByRoleCode(
        "TRACKER_USER"
      );
      userDetails.current_role = roleDetails.id;
      let newUserAccount = await UserAccountModel.create(userDetails as any);
      let newUserAccountObj = newUserAccount?.toJSON();
      delete newUserAccountObj.password;
      return newUserAccountObj;
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
