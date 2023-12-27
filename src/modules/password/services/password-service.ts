import {Logger} from "../../../logger";
import PasswordModel from "../models/password.model";
export default class PasswordService {
    static async createPassword(passwordDetails: PasswordModel) {
        try {
            Logger.INFO(PasswordService.name, "Inside create feature");
            const dataValues = passwordDetails.dataValues;
            let password = await PasswordModel.create(dataValues);
            return password;
        } catch (err: any){
            Logger.ERROR(PasswordService.name, err);
        }    
    }
}