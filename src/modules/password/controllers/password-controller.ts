import { Request, Response } from "express";
import { Logger } from "../../../logger";
import Cryptr from "cryptr";
import PasswordModel from "../models/password.model";
import { TokenData } from "../../../../types/express";
import PasswordService from "../services/password-service";

export default class PasswordController {
    static async getUserPasswords(req: Request, res: Response) {
        try {
            Logger.INFO(PasswordController.name, PasswordController.getUserPasswords.name, "Inside get user passwords");
            let result = await PasswordModel.findAll();
            res.status(200).json({
                data: result,
                message: "User passwords list fetched successfully"
            });
        } catch (err: any){
            Logger.ERROR(PasswordController.name, PasswordController.getUserPasswords.name, err);
        }
    }

    static async getPasswordDetails(req: Request, res: Response) {
        try {
            Logger.INFO(PasswordController.name, PasswordController.getPasswordDetails.name, "Inside get user passwords");
            let passwordId = req.params.id;
            let result = await PasswordModel.findByPk(passwordId);
            if (result) {
                let cryptrObj = new Cryptr(process.env.TOKEN_KEY as string);
                result.dataValues.plain_password = cryptrObj.decrypt(result?.dataValues.password);
            }
            res.status(200).json({
                data: result,
                message: "User passwords list fetched successfully"
            });
        } catch (err: any){
            Logger.ERROR(PasswordController.name, PasswordController.getPasswordDetails.name, err);
        }
    }

    static async createUserPassword(req: Request, res: Response) {
        try {
            Logger.INFO(PasswordController.name, PasswordController.createUserPassword.name, "Inside create user password");
            let reqBody = req.body;
            let passwordObj: PasswordModel = new PasswordModel();
            passwordObj.name = reqBody.name;
            passwordObj.site_link = reqBody.site_link;
            passwordObj.username = reqBody.username;
            let cryptrObj = new Cryptr(process.env.TOKEN_KEY as string);
            passwordObj.password = cryptrObj.encrypt(reqBody.plain_password);;
            let tokenData = req.tokenData as TokenData;
            passwordObj.user_id = tokenData.user_id;
            let newPassword = await PasswordService.createPassword(passwordObj);
            res.status(200).json({
                newPassword,
                message: "User passwords created successfully"
            });
        } catch (err: any){
            Logger.ERROR(PasswordController.name, PasswordController.createUserPassword.name, err);
        }
    }

    static async updateUserPassword(req: Request, res: Response) {
        try {
            Logger.INFO(PasswordController.name, PasswordController.updateUserPassword.name, "Inside update user password");
            let passwordId = parseInt(req.params.id);
            let reqBody = req.body;
            let passwordObj: PasswordModel = new PasswordModel();
            passwordObj.name = reqBody.name;
            passwordObj.site_link = reqBody.site_link;
            passwordObj.username = reqBody.username;
            let cryptrObj = new Cryptr(process.env.TOKEN_KEY as string);
            passwordObj.password = cryptrObj.encrypt(reqBody.plain_password);;
            let tokenData = req.tokenData as TokenData;
            passwordObj.user_id = tokenData.user_id;
            let newPassword = await PasswordService.updatePassword(passwordId,passwordObj);
            res.status(204).json({
                newPassword,
                message: "User password updated successfully"
            });
        } catch (err: any){
            Logger.ERROR(PasswordController.name, PasswordController.updateUserPassword.name, err);
        }
    }

    static async deleteUserPassword(req: Request, res: Response) {
        try {
            Logger.INFO(PasswordController.name, PasswordController.deleteUserPassword.name, "Inside update user password");
            let passwordId = parseInt(req.params.id);
            let result = await PasswordModel.destroy({
                where: {
                    id: passwordId
                }
            })
            if (result) {
                res.status(200).json({
                    message: "User password deleted successfully"
                });
            } else {
                throw "Error while deleting password"
            }
            
        } catch (err: any){
            Logger.ERROR(PasswordController.name, PasswordController.deleteUserPassword.name, err);
            res.status(500).json({
                message: "Error while deleteing password"
            })
        }
    }
}