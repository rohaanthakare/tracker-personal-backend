import { Logger } from "../../../logger";
import RoleModel from "../models/role.model";
import RoleDataAccessor from "../data-accessors/role-data-accessor";

export default class RoleService {
    static async createOrUpdateRole(roleDetails: RoleModel) {
        try {
            Logger.INFO(RoleService.name, "Inside createOrUpdateRole");
            console.log(roleDetails.dataValues);
            let inputRoleDetail = roleDetails.dataValues as RoleModel;
            let role = await RoleDataAccessor.getRoleByRoleCode(inputRoleDetail.role_code);
            let resultRoleObj;
            if (role) {
                inputRoleDetail.id = role.id;
                let result = await RoleModel.update(inputRoleDetail, {
                    where: {
                        id: role.id
                    }
                });
                if (result.length > 0 && result[0] > 0) {
                    resultRoleObj = await RoleModel.findByPk(role.id);
                }
            } else {
                resultRoleObj = await RoleModel.create(roleDetails.dataValues);
            }
            
            return resultRoleObj;
        } catch (error: any) {
            Logger.ERROR(RoleService.name, error);
            throw error;
        }
    }
}