import { Op } from "sequelize";
import { Logger } from "../../../logger";
import FeatureModel from "../models/feature.model";
import RoleFeatureModel from "../models/role-feature.model";
import RoleModel from "../models/role.model";

export default class RoleDataAccessor {
  static async getRoleByRoleCode(roleCode: string) {
    try {
      let result = await RoleModel.findOne({
        where: {
          role_code: roleCode,
        },
      });
      return result?.dataValues;
    } catch (err: any) {
      Logger.ERROR(
        RoleDataAccessor.name,
        RoleDataAccessor.getRoleByRoleCode.name,
        err
      );
    }
  }

  static async getRoleFeaturesByRoleId(roleId: number) {
    try {
      let roleFeatures = await RoleFeatureModel.findAll({
        where: {
          role_id: roleId,
        },
      });
      let featureIds: number[] = [];
      roleFeatures.forEach((rf) => {
        featureIds.push(rf.feature_id);
      });

      let features = await FeatureModel.findAll({
        where: {
          id: {
            [Op.in]: featureIds,
          },
        },
      });
      return features;
    } catch (err: any) {
      Logger.ERROR(
        RoleDataAccessor.name,
        RoleDataAccessor.getRoleFeaturesByRoleId.name,
        err
      );
    }
  }
}
