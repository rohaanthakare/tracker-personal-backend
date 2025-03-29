import { Request, Response } from "express";
import fs from "fs";
import appRootPath from "app-root-path";
import { Logger } from "../../logger";
import { IRoleModel } from "../user/models/role.model";
import RoleService from "../user/services/role-service";
import * as bcrypt from "bcrypt";
import UserService from "../user/services/user-service";
import { IUserAccountModel } from "../user/models/user-account.model";
import { IFeatureModel } from "../user/models/feature.model";
import FeatureService from "../user/services/feature-service";
import { IRoleFeatureModel } from "../user/models/role-feature.model";

export default class CoreController {
  static async setupApplication(req: Request, res: Response) {
    try {
      Logger.INFO(
        CoreController.name,
        CoreController.setupApplication.name,
        "Inside setup Application"
      );
      // Create Features
      let featureObj: IFeatureModel = {
        feature_code: "import_app_data",
        feature_name: "Import Data",
        description: "Import application data",
        is_active: true,
        feature_type: "SIDE_NAV",
        feature_icon: "mdi mdi-file-import",
        feature_url: "/user/import-data",
      };

      let newFeature = await FeatureService.createOrUpdateFeature(featureObj);
      // Create Role
      let roleObj: IRoleModel = {
        role_code: "superadmin",
        role_name: "Superadmin",
        description: "Superadmin for Tracker application",
      };
      let newRole = await RoleService.createOrUpdateRole(roleObj);
      // Create Role Feature Mapping
      if (!newRole) {
        throw `Role ${roleObj.role_code} does not exist`;
      }
      let roleFeatureObj: IRoleFeatureModel = {
        role_id: newRole.id,
        feature_id: newFeature?.id,
      };

      let roleFeature = await FeatureService.createRoleFeatureMapping(
        roleFeatureObj
      );
      // Create Superadmin user account
      let userAccount: IUserAccountModel = {
        username: "superadmin",
        password: bcrypt.hashSync("superadmin", 10),
        email: "superadmin@tracker.com",
        mobile_no: 9999,
        current_role: newRole.id,
      };

      let newUser = await UserService.createUserAccount(userAccount);
      res.status(200).send({
        message: "Application setup done successfully",
      });
    } catch (error: any) {
      Logger.ERROR(
        CoreController.name,
        CoreController.setupApplication.name,
        error
      );
      res.status(500).json({
        message: "Internal server error, please try again",
      });
    }
  }

  static async getApplicationDataModulesToLoad(req: Request, res: Response) {
    try {
      Logger.INFO(
        CoreController.name,
        CoreController.getApplicationDataModulesToLoad.name,
        "Inside get Application data load"
      );
      let rootPath = appRootPath.path;
      let dataToLoad = JSON.parse(
        fs.readFileSync(`${rootPath}/assets/data-load.json`, "utf8")
      );
      res.status(200).send({
        message: "Application data to load fetched successfully",
        data: dataToLoad,
      });
    } catch (error: any) {
      Logger.ERROR(
        CoreController.name,
        CoreController.getApplicationDataModulesToLoad.name,
        error
      );
      res.status(500).json({
        message: "Internal server error, please try again",
      });
    }
  }

  static async getModuleDataToLoad(req: Request, res: Response) {
    try {
      Logger.INFO(
        CoreController.name,
        CoreController.getModuleDataToLoad.name,
        "Inside get Application data load"
      );
      let rootPath = appRootPath.path;
      let dataToLoad = JSON.parse(
        fs.readFileSync(`${rootPath}/assets/${req.query.dataFile}`, "utf8")
      );
      res.status(200).send({
        message: "Application data to load fetched successfully",
        data: dataToLoad,
      });
    } catch (error: any) {
      Logger.ERROR(
        CoreController.name,
        CoreController.getModuleDataToLoad.name,
        error
      );
      res.status(500).json({
        message: "Internal server error, please try again",
      });
    }
  }
}
