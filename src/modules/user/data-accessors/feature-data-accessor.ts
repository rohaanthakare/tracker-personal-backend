import { Logger } from "../../../logger";
import { FeatureModel } from "../models/feature.model";
import {
  IRoleFeatureModel,
  RoleFeatureModel,
} from "../models/role-feature.model";
export default class FeatureDataAccessor {
  static async getFeatureByFeatureCode(featureCode: string) {
    try {
      let result = await FeatureModel.findOne({
        where: {
          feature_code: featureCode,
        },
      });
      return result?.toJSON();
    } catch (err: any) {
      Logger.ERROR(
        FeatureDataAccessor.name,
        FeatureDataAccessor.getFeatureByFeatureCode.name,
        err
      );
      throw err;
    }
  }

  static async getRoleFeatureByRoleAndFeature(
    roleFeatureDetails: IRoleFeatureModel
  ) {
    try {
      let result = await RoleFeatureModel.findOne({
        where: {
          feature_id: roleFeatureDetails.feature_id,
          role_id: roleFeatureDetails.role_id,
        },
      });
      return result?.toJSON();
    } catch (err: any) {
      Logger.ERROR(
        FeatureDataAccessor.name,
        FeatureDataAccessor.getRoleFeatureByRoleAndFeature.name,
        err
      );
      throw err;
    }
  }
}
