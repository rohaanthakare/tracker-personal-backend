import { Logger } from "../../../logger";
import FeatureModel from "../models/feature.model";
import FeatureDataAccessor from "../data-accessors/feature-data-accessor";
import RoleFeatureModel from "../models/role-feature.model";

export default class FeatureService {
    static async createOrUpdateFeature(featureDetails: FeatureModel) {
        try {
            Logger.INFO(FeatureService.name, "Inside create feature");
            const dataValues = featureDetails.dataValues;
            let existingFeatureDetails = await FeatureDataAccessor.getFeatureByFeatureCode(dataValues.feature_code);
            let feature;
            if (existingFeatureDetails?.dataValues) {
                dataValues.id = existingFeatureDetails.dataValues.id;
                let result = await FeatureModel.update(dataValues, {
                    where: {
                        id: existingFeatureDetails.dataValues.id
                    }
                });

                if (result.length > 0 && result[0] > 0) {
                    feature = await FeatureModel.findByPk(existingFeatureDetails.dataValues.id);
                }
            } else {
                feature = await FeatureModel.create(dataValues);
            }
            return feature;
        } catch (err: any){
            Logger.ERROR(FeatureService.name, err);
        }    
    }

    static async createRoleFeatureMapping(roleFeatureDetails: RoleFeatureModel) {
        try {
            Logger.INFO(FeatureService.name, "Inside create role feature mapping");
            const dataValues = roleFeatureDetails.dataValues;
            let existingRoleFeatureDetails = await FeatureDataAccessor.getRoleFeatureByRoleAndFeature(roleFeatureDetails);
            let roleFeature;
            if (existingRoleFeatureDetails?.dataValues) {
                dataValues.id = existingRoleFeatureDetails.dataValues.id;
                let result = await RoleFeatureModel.update(dataValues, {
                    where: {
                        id: existingRoleFeatureDetails.dataValues.id
                    }
                });

                if (result.length > 0 && result[0] > 0) {
                    roleFeature = await RoleFeatureModel.findByPk(existingRoleFeatureDetails.dataValues.id);
                }
            } else {
                roleFeature = await RoleFeatureModel.create(dataValues);
            }
            return roleFeature;
        } catch (err: any){
            Logger.ERROR(FeatureService.name, err);
            throw err;
        }    
    }
}