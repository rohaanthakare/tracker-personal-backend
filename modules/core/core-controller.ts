import { Request, Response } from "express";
import { Logger } from "../../logger";
import RoleModel from "../user/models/role.model";
import RoleService from "../user/role-service";
import * as bcrypt from "bcrypt";
import UserService from "../user/user-service";

export default class CoreController {
    static async setupApplication(req: Request, res: Response) {
        try {
            Logger.INFO(CoreController.name, "Inside setup Application");
            let roleObj: any = {};
            roleObj.role_code = "superadmin";
            roleObj.role_name = "Superadmin";
            roleObj.description = "Superadmin for Tracker application";
            let newRole = await RoleService.createRole(roleObj);
            await bcrypt.hash("superadmin", 10, async (err, hash) => {
                let userAccount:any = {};
                userAccount.username = "superadmin";
                userAccount.password = hash;
                userAccount.email = "superadmin@tracker.com";
                userAccount.mobile_no = 9999999999;
                userAccount.current_role = newRole.id;
                let newUser = await UserService.createUserAccount(userAccount); 
            });
            res.status(200).send({
                message: "Application setup done successfully"
            });
        } catch (error: any) {
            Logger.ERROR(CoreController.name, error);
            res.status(500).json({
                message: "Internal server error, please try again"
            });
        }
    }
}