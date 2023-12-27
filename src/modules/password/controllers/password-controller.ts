import { Request, Response } from "express";
import { Logger } from "../../../logger";
import Cryptr from "cryptr";
import PasswordModel from "../models/password.model";
import { TokenData } from "../../../../types/express";
import PasswordService from "../services/password-service";

export default class PasswordController {
    static async getUserPasswords(req: Request, res: Response) {
        try {
            Logger.INFO(PasswordController.name, "Inside get user passwords");
            let result = await PasswordModel.findAll();
            /* let cryptrObj = new Cryptr(process.env.TOKEN_KEY as string);
            await result.forEach((r: any) => {
                r.dataValues.plain_password = cryptrObj.decrypt(r.dataValues.password);
                console.log(r);
            }); */
            res.status(200).json({
                data: result,
                message: "User passwords list fetched successfully"
            });
        } catch (err: any){
            Logger.ERROR(PasswordController.name, err);
        }
    }

    static async createUserPassword(req: Request, res: Response) {
        try {
            Logger.INFO(PasswordController.name, "Inside create user password");
            let reqBody = req.body;
            let passwordObj: PasswordModel = new PasswordModel();
            passwordObj.name = reqBody.name;
            passwordObj.site_link = reqBody.site_link;
            passwordObj.username = reqBody.username;
            let cryptrObj = new Cryptr(process.env.TOKEN_KEY as string);
            passwordObj.password = cryptrObj.encrypt(reqBody.password);;
            let tokenData = req.tokenData as TokenData;
            passwordObj.user_id = tokenData.user_id;
            let newPassword = await PasswordService.createPassword(passwordObj);
            res.status(200).json({
                newPassword,
                message: "User passwords created successfully"
            });
        } catch (err: any){
            Logger.ERROR(PasswordController.name, err);
        }
    }
}