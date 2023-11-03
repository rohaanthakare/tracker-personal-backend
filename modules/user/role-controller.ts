import { Request, Response } from "express";
import { Logger } from "../../logger";
import RoleService from "./role-service";

export default class RoleController {
    static async createRole(req: Request, res: Response) {
        try {
            let roleDetails = req.body;
            let result = await RoleService.createRole(roleDetails);
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