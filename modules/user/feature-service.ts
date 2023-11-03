import { Request, Response } from "express";
import { Logger } from "../../logger";
import FeatureModel from "./models/feature.model";
import RoleFeatureModel from "./models/role-feature.model";

export default class FeatureService {
    static async createFeature(featureDetails: FeatureModel) {
        try {
            Logger.INFO(FeatureService.name, "Inside create feature");
            let newFeature = await FeatureModel.create(featureDetails.dataValues);
            return newFeature;
        } catch (err: any){
            Logger.ERROR(FeatureService.name, err);
        }    
    }

    static async createRoleFeatureMapping(roleFeatureDetails: RoleFeatureModel) {
        try {
            Logger.INFO(FeatureService.name, "Inside create role feature mapping");
            let newRoleFeature = await RoleFeatureModel.create(roleFeatureDetails.dataValues);
            return newRoleFeature;
        } catch (err: any){
            Logger.ERROR(FeatureService.name, err);
        }    
    }
}