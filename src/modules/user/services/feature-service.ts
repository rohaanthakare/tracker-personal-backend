import { Logger } from "../../../logger";
import { FeatureModel, IFeatureModel } from "../models/feature.model";
import FeatureDataAccessor from "../data-accessors/feature-data-accessor";
import {
  IRoleFeatureModel,
  RoleFeatureModel,
} from "../models/role-feature.model";

export default class FeatureService {
  static async createOrUpdateFeature(featureDetails: IFeatureModel) {
    try {
      Logger.INFO(
        FeatureService.name,
        FeatureService.createOrUpdateFeature.name,
        "Inside create feature"
      );
      let existingFeatureDetails: IFeatureModel =
        await FeatureDataAccessor.getFeatureByFeatureCode(
          featureDetails.feature_code as string
        );
      let feature;
      if (existingFeatureDetails) {
        existingFeatureDetails.id = existingFeatureDetails.id;
        let result = await FeatureModel.update(existingFeatureDetails, {
          where: {
            id: existingFeatureDetails.id,
          },
        });

        if (result.length > 0 && result[0] > 0) {
          feature = await FeatureModel.findByPk(existingFeatureDetails.id);
        }
      } else {
        feature = await FeatureModel.create(featureDetails as any);
      }
      return feature?.toJSON();
    } catch (err: any) {
      Logger.ERROR(
        FeatureService.name,
        FeatureService.createOrUpdateFeature.name,
        err
      );
    }
  }

  static async createRoleFeatureMapping(roleFeatureDetails: IRoleFeatureModel) {
    try {
      Logger.INFO(
        FeatureService.name,
        FeatureService.createRoleFeatureMapping.name,
        "Inside create role feature mapping"
      );
      let existingRoleFeatureDetails =
        await FeatureDataAccessor.getRoleFeatureByRoleAndFeature(
          roleFeatureDetails
        );
      let roleFeature;
      if (existingRoleFeatureDetails) {
        existingRoleFeatureDetails.id = existingRoleFeatureDetails.id;
        let result = await RoleFeatureModel.update(roleFeatureDetails, {
          where: {
            id: existingRoleFeatureDetails.id,
          },
        });

        if (result.length > 0 && result[0] > 0) {
          roleFeature = await RoleFeatureModel.findByPk(
            existingRoleFeatureDetails.id
          );
        }
      } else {
        roleFeature = await RoleFeatureModel.create(roleFeatureDetails as any);
      }
      return roleFeature?.toJSON();
    } catch (err: any) {
      Logger.ERROR(
        FeatureService.name,
        FeatureService.createRoleFeatureMapping.name,
        err
      );
      throw err;
    }
  }
}
