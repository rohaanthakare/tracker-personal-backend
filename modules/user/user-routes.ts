import express from "express";
import UserController from "./user-controller";
import RoleController from "./role-controller";
import FeatureController from "./feature-controller";

export const userRoutes = express.Router();

userRoutes.get("/users", UserController.getUsers);
userRoutes.post("/user", UserController.createUser);
userRoutes.post("/authenticate", UserController.authenticateUser);
userRoutes.post("/create-role", RoleController.createRole);
userRoutes.post("/create-feature", FeatureController.createFeature);
userRoutes.post("/create-role-feature-mapping", FeatureController.createRoleFeatureMapping);
userRoutes.get("/user-features", FeatureController.getUserRoleFeatures);