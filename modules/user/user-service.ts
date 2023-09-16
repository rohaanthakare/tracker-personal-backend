import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserAccountModel from "./models/user-account.model";
import { Logger } from "../../logger";
export default class UserService {
    static LOGGER_NAME = "UserService";
    static async createUserAccount(userDetails: any) {
        try {
            let result = await UserAccountModel.create(userDetails);
            return result.dataValues;
        } catch (error: any) {
            Logger.ERROR(this.LOGGER_NAME, error);
            throw error;
        }
    }

    static async authenticateUser(userCred: UserAccountModel) {
        try {
            let result = await UserAccountModel.findOne({
                where: {
                    username: userCred.username
                }
            });
            if (result) {
                const res = bcrypt.compareSync(userCred.password, result?.password);
                if (res) {
                    // Generate JWT Token
                    const user_data = {username: result.username};
                    const user_token = jwt.sign(user_data, process.env.TOKEN_KEY as string, {
                        algorithm : "HS256",
                        expiresIn: "7d"
                        
                    });
                    return {token: user_token};
                } else {
                    throw `Incorrect password, forgot password ?`;    
                }
            } else {
                throw `User ${userCred.username} does not exist`;
            }
        } catch (error: any) {
            Logger.ERROR(UserService.name, error);
            throw error;
        }
    }
}