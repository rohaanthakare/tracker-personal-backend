import { Request, Response } from "express";
import { Logger } from "../../logger";
import { TokenData } from "../../types/express";
import RoleDataAccessor from "./role-data-accessor";

export default class FeatureController {
    static async createFeature(req: Request, res: Response) {
        try {
            Logger.INFO(FeatureController.name, "Inside create feature");
        } catch (err: any){
            Logger.ERROR(FeatureController.name, err);
        }    
    }

    static async createRoleFeatureMapping(req: Request, res: Response) {
        try {
            Logger.INFO(FeatureController.name, "Inside create role feature mapping");
        } catch (err: any){
            Logger.ERROR(FeatureController.name, err);
        }    
    }

    static async getUserRoleFeatures(req: Request, res: Response) {
        try {
            Logger.INFO(FeatureController.name, "Inside get role feature mapping");
            let tokenData = req.tokenData as TokenData;
            let features = await RoleDataAccessor.getRoleFeaturesByRoleId(tokenData.current_role);
            res.status(200).json({
                message: "Test",
                features
            })
        } catch (err: any){
            Logger.ERROR(FeatureController.name, err);
        }    
    }
}