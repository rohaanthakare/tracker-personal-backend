import { Request, Response } from "express";
import { Logger } from "../../../logger";
import RoleService from "../services/role-service";
import RoleModel from "../models/role.model";

export default class RoleController {
    static async createRole(req: Request, res: Response) {
        try {
            let roleDetailsInput = req.body as RoleModel;
            let inputRoleObj: RoleModel = new RoleModel();
            inputRoleObj.role_code = roleDetailsInput.role_code;
            inputRoleObj.role_name = roleDetailsInput.role_name;
            inputRoleObj.description = roleDetailsInput.description;
            let result = await RoleService.createOrUpdateRole(inputRoleObj);
            res.status(201).json({
                message: "Role created successfully",
                result
            });
        } catch (err: any){
            Logger.ERROR(RoleController.name, err);
            res.status(500).json({
                message: err
            });
        }
    }
}