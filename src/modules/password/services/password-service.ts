import { Logger } from "../../../logger";
import { IPasswordModel, PasswordModel } from "../models/password.model";
export default class PasswordService {
  static async createPassword(passwordDetails: IPasswordModel) {
    try {
      Logger.INFO(
        PasswordService.name,
        PasswordService.createPassword.name,
        "Inside create password"
      );
      let password = await PasswordModel.create(passwordDetails as any);
      return password.toJSON();
    } catch (err: any) {
      Logger.ERROR(
        PasswordService.name,
        PasswordService.createPassword.name,
        err
      );
    }
  }

  static async updatePassword(
    passwordId: number,
    passwordDetails: IPasswordModel
  ) {
    try {
      Logger.INFO(
        PasswordService.name,
        PasswordService.updatePassword.name,
        "Inside update password"
      );
      passwordDetails.id = passwordId;
      let password = await PasswordModel.update(passwordDetails, {
        where: {
          id: passwordId,
        },
      });
      return password;
    } catch (err: any) {
      Logger.ERROR(
        PasswordService.name,
        PasswordService.updatePassword.name,
        err
      );
    }
  }
}
