import {Logger} from "../../../logger";
import PasswordModel from "../models/password.model";
export default class PasswordService {
    static async createPassword(passwordDetails: PasswordModel) {
        try {
            Logger.INFO(PasswordService.name, "Inside create password");
            const dataValues = passwordDetails.dataValues;
            let password = await PasswordModel.create(dataValues);
            return password;
        } catch (err: any){
            Logger.ERROR(PasswordService.name, err);
        }    
    }

    static async updatePassword(passwordId: number, passwordDetails: PasswordModel) {
        try {
            Logger.INFO(PasswordService.name, "Inside update password");
            const dataValues = passwordDetails.dataValues;
            dataValues.id = passwordId;
            let password = await PasswordModel.update(dataValues, {
                where: {
                    id: passwordId
                }
            });
            return password;
        } catch (err: any){
            Logger.ERROR(PasswordService.name, err);
        }    
    }
}