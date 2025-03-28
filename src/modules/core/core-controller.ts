import { Request, Response } from "express";
import fs from "fs";
import appRootPath from "app-root-path";
import { dirname } from "path";
import { Logger } from "../../logger";
import RoleModel from "../user/models/role.model";
import RoleService from "../user/services/role-service";
import * as bcrypt from "bcrypt";
import UserService from "../user/services/user-service";
import UserAccountModel from "../user/models/user-account.model";
import FeatureModel from "../user/models/feature.model";
import FeatureService from "../user/services/feature-service";
import RoleFeatureModel from "../user/models/role-feature.model";

export default class CoreController {
    static async setupApplication(req: Request, res: Response) {
        try {
            Logger.INFO(CoreController.name, CoreController.setupApplication.name,"Inside setup Application");
            // Create Features
            let featureObj: FeatureModel = new FeatureModel();
            featureObj.feature_code = "import_app_data";
            featureObj.feature_name = "Import Data";
            featureObj.description = "Import application data";
            featureObj.is_active = true;
            featureObj.feature_type = "SIDE_NAV";
            featureObj.feature_icon = "mdi mdi-file-import";
            featureObj.feature_url = "/user/import-data";
            let newFeature = await FeatureService.createOrUpdateFeature(featureObj);
            // Create Role
            let roleObj: RoleModel = new RoleModel();
            roleObj.role_code = "superadmin";
            roleObj.role_name = "Superadmin";
            roleObj.description = "Superadmin for Tracker application";
            let newRole = await RoleService.createOrUpdateRole(roleObj);
            // Create Role Feature Mapping
            if (!newRole) {
                throw `Role ${roleObj.role_code} does not exist`;
            }
            let roleFeatureObj: RoleFeatureModel = new RoleFeatureModel();
            roleFeatureObj.role_id = newRole.id;
            roleFeatureObj.feature_id = newFeature?.id as number;
            let roleFeature = await FeatureService.createRoleFeatureMapping(roleFeatureObj);
            // Create Superadmin user account
            let userAccount:UserAccountModel = new UserAccountModel();
            userAccount.username = "superadmin";
            userAccount.password = bcrypt.hashSync("superadmin", 10);
            userAccount.email = "superadmin@tracker.com";
            userAccount.mobile_no = 9999;
            userAccount.current_role = newRole.id;
            let newUser = await UserService.createUserAccount(userAccount); 
            res.status(200).send({
                message: "Application setup done successfully"
            });
        } catch (error: any) {
            Logger.ERROR(CoreController.name, CoreController.setupApplication.name,error);
            res.status(500).json({
                message: "Internal server error, please try again"
            });
        }
    }

    static async getApplicationDataModulesToLoad(req: Request, res: Response) {
        try {
            Logger.INFO(CoreController.name, CoreController.getApplicationDataModulesToLoad.name,"Inside get Application data load");
            let rootPath = appRootPath.path;
            let dataToLoad = JSON.parse(fs.readFileSync(`${rootPath}/assets/data-load.json`, "utf8"));
            res.status(200).send({
                message: "Application data to load fetched successfully",
                data: dataToLoad
            });
        } catch (error: any) {
            Logger.ERROR(CoreController.name, CoreController.getApplicationDataModulesToLoad.name, error);
            res.status(500).json({
                message: "Internal server error, please try again"
            });
        }
    }

    static async getModuleDataToLoad(req: Request, res: Response) {
        try {
            Logger.INFO(CoreController.name, CoreController.getModuleDataToLoad.name, "Inside get Application data load");
            let rootPath = appRootPath.path;
            let dataToLoad = JSON.parse(fs.readFileSync(`${rootPath}/assets/${req.query.dataFile}`, "utf8"));
            res.status(200).send({
                message: "Application data to load fetched successfully",
                data: dataToLoad
            });
        } catch (error: any) {
            Logger.ERROR(CoreController.name, CoreController.getModuleDataToLoad.name, error);
            res.status(500).json({
                message: "Internal server error, please try again"
            });
        }
    }
}