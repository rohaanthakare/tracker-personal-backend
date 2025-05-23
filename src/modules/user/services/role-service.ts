import { Logger } from "../../../logger";
import { IRoleModel, RoleModel } from "../models/role.model";
import RoleDataAccessor from "../data-accessors/role-data-accessor";

export default class RoleService {
  static async createOrUpdateRole(roleDetails: IRoleModel) {
    try {
      Logger.INFO(
        RoleService.name,
        RoleService.createOrUpdateRole.name,
        "Inside createOrUpdateRole"
      );
      let inputRoleDetail: IRoleModel = roleDetails;
      let role = await RoleDataAccessor.getRoleByRoleCode(
        inputRoleDetail.role_code as string
      );
      let resultRoleObj;
      if (role) {
        inputRoleDetail.id = role.id;
        let result = await RoleModel.update(inputRoleDetail, {
          where: {
            id: role.id,
          },
        });
        if (result.length > 0 && result[0] > 0) {
          resultRoleObj = await RoleModel.findByPk(role.id);
        }
      } else {
        resultRoleObj = await RoleModel.create(roleDetails as any);
      }

      return resultRoleObj?.toJSON();
    } catch (error: any) {
      Logger.ERROR(
        RoleService.name,
        RoleService.createOrUpdateRole.name,
        error
      );
      throw error;
    }
  }
}
