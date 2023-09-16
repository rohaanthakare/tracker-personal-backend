import dbconnection from "../../app-db";
import { Logger } from "../../logger";
import RoleModel from "./models/role.model";

export default class RoleService {
    static async createRole(roleDetails: any) {
        try {
            let newRole = await RoleModel.create(roleDetails);
            return newRole;
        } catch (error: any) {
            Logger.ERROR(RoleService.name, error);
            throw error;
        }
    }
}