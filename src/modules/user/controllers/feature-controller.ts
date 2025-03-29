import { Request, Response } from "express";
import { Logger } from "../../../logger";
import { TokenData } from "../../../../types/express";
import RoleDataAccessor from "../data-accessors/role-data-accessor";
import { IFeatureModel } from "../models/feature.model";
import FeatureService from "../services/feature-service";
import {
  IRoleFeatureModel,
  RoleFeatureModel,
} from "../models/role-feature.model";
import FeatureDataAccessor from "../data-accessors/feature-data-accessor";

export default class FeatureController {
  static async createOrUpdateFeature(req: Request, res: Response) {
    try {
      Logger.INFO(
        FeatureController.name,
        FeatureController.createOrUpdateFeature.name,
        "Inside create feature"
      );
      let feature: IFeatureModel = {};
      let reqBody = req.body;
      feature.description = reqBody.description;
      feature.feature_code = reqBody.feature_code;
      feature.feature_icon = reqBody.feature_icon;
      feature.feature_name = reqBody.feature_name;
      feature.feature_type = reqBody.feature_type;
      feature.feature_url = reqBody.feature_url;
      feature.is_active = reqBody.is_active;
      let parentFeature;
      if (reqBody.parent_feature) {
        parentFeature = await FeatureDataAccessor.getFeatureByFeatureCode(
          reqBody.parent_feature
        );
        feature.parent_feature_id = parentFeature?.id as number;
      }
      let newFeature = await FeatureService.createOrUpdateFeature(feature);
      if (newFeature?.isNewRecord) {
        res.status(201).json({
          message: "Feature created successfully",
          newFeature,
        });
      } else {
        res.status(204).json({
          message: "Feature updated successfully",
          newFeature,
        });
      }
    } catch (err: any) {
      Logger.ERROR(
        FeatureController.name,
        FeatureController.createOrUpdateFeature.name,
        err
      );
    }
  }

  static async createOrUpdateRoleFeatureMapping(req: Request, res: Response) {
    try {
      Logger.INFO(
        FeatureController.name,
        FeatureController.createOrUpdateRoleFeatureMapping.name,
        "Inside create role feature mapping"
      );
      let roleFeatureDetails: IRoleFeatureModel = {};
      let reqBody = req.body;
      let roleDetails = await RoleDataAccessor.getRoleByRoleCode(
        reqBody.role_code
      );
      let featureDetails = await FeatureDataAccessor.getFeatureByFeatureCode(
        reqBody.feature_code
      );
      roleFeatureDetails.role_id = roleDetails?.id as number;
      roleFeatureDetails.feature_id = featureDetails?.id as number;
      let roleFeatureMapping = await FeatureService.createRoleFeatureMapping(
        roleFeatureDetails
      );
      if (roleFeatureMapping?.isNewRecord) {
        res.status(201).json({
          message: "Role Feature created successfully",
          roleFeatureMapping,
        });
      } else {
        res.status(204).json({
          message: "Role Feature updated successfully",
          roleFeatureMapping,
        });
      }
    } catch (err: any) {
      Logger.ERROR(
        FeatureController.name,
        FeatureController.createOrUpdateRoleFeatureMapping.name,
        err
      );
      res.status(500).json({
        message: "Error while creating role feature mapping",
      });
    }
  }

  static async getUserRoleFeatures(req: Request, res: Response) {
    try {
      Logger.INFO(
        FeatureController.name,
        FeatureController.getUserRoleFeatures.name,
        "Inside get role feature mapping"
      );
      let tokenData = req.tokenData as TokenData;
      let features = await RoleDataAccessor.getRoleFeaturesByRoleId(
        tokenData.current_role
      );
      res.status(200).json({
        message: "Test",
        features,
      });
    } catch (err: any) {
      Logger.ERROR(
        FeatureController.name,
        FeatureController.getUserRoleFeatures.name,
        err
      );
    }
  }
}
