import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { Logger } from "../../../logger";
import { UserAccountModel } from "../models/user-account.model";
import UserService from "../services/user-service";
import RoleDataAccessor from "../data-accessors/role-data-accessor";
import UserWorkflows from "../workflows/user-workflows";
import HelperService from "../../core/helper.service";

const loggerName = "UserController";
export default class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      Logger.INFO(
        UserController.name,
        UserController.getUsers.name,
        "Inside get users list"
      );
      let result = await UserAccountModel.findAll();
      result = result.map((r) => r.toJSON());
      res.status(200).json({
        data: result,
        message: "User list fetched successfully",
      });
    } catch (err: any) {
      Logger.ERROR(UserController.name, UserController.getUsers.name, err);
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      let userBody = req.body;
      let roleObj = await RoleDataAccessor.getRoleByRoleCode(
        userBody.current_role
      );
      userBody.current_role = roleObj?.id;
      userBody.password = bcrypt.hashSync(userBody.password, 10);
      let result = await UserAccountModel.create(userBody);
      let newUser = result.toJSON();
      Logger.INFO(
        UserController.name,
        UserController.createUser.name,
        `User created successfully - ${userBody.username}`
      );
      res.status(201).json({
        data: newUser,
        message: "User created successfully",
      });
    } catch (err: any) {
      Logger.ERROR(UserController.name, UserController.createUser.name, err);
      res.status(500).json({
        message: "Error while creating user, please try again",
      });
    }
  }

  static async registerUser(req: Request, res: Response) {
    try {
      let userBody = req.body;
      let result = await UserWorkflows.registerUserWorkflow(userBody);
      Logger.INFO(
        UserController.name,
        UserController.createUser.name,
        `User created successfully - ${userBody.username}`
      );
      res.status(201).json({
        message: "User created successfully",
      });
    } catch (err: any) {
      Logger.ERROR(UserController.name, UserController.registerUser.name, err);
      res.status(500).json({
        message: HelperService.getAPIErrorMessage(
          err,
          "Error while creating user, please try again"
        ),
      });
    }
  }

  static async authenticateUser(req: Request, res: Response) {
    try {
      let userBody = req.body;
      let result = await UserService.authenticateUser(userBody);
      res.status(201).json({
        message: "User authenticated successfully",
        token: result.token,
        username: result.username,
      });
    } catch (err: any) {
      Logger.ERROR(
        UserController.name,
        UserController.authenticateUser.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }
}
