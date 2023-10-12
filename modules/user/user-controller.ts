import { Request, Response } from "express";
import { Logger } from "../../logger";
import UserAccountModel from "./models/user-account.model";
import UserService from "./user-service";

const loggerName = "UserController";
export default class UserController {
    static async getUsers(req: Request, res: Response) {
        try {
            Logger.INFO(loggerName, "Inside get users list");
            let result = await UserAccountModel.findAll();
            res.status(200).json({
                data: result,
                message: "User list fetched successfully"
            });
        } catch (err: any){
            Logger.ERROR(loggerName, err);
        }
    }
    
    static async createUser(req: Request, res: Response) {
        try {
            let userBody = req.body;
            let result = await UserAccountModel.create(userBody);
            let newUser = result.dataValues;
            Logger.INFO(loggerName, `User created successfully - ${userBody.username}`);
            res.status(201).json({
                data: newUser,
                message: "User created successfully"
            });
        } catch (err: any){
            Logger.ERROR(loggerName, err);
        }
    }

    static async authenticateUser(req: Request, res: Response) {
        try {
            let userBody = req.body;
            let result = await UserService.authenticateUser(userBody);
            res.status(201).json({
                message: "User authenticated successfully",
                token: result.token,
                is_superadmin: result.is_superadmin
            });
        } catch (err: any){
            Logger.ERROR(loggerName, err);
            res.status(500).json({
                message: err
            });
        }
    }
}