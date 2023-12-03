import express from "express";
import UserController from "./controllers/user-controller";
import RoleController from "./controllers/role-controller";
import FeatureController from "./controllers/feature-controller";

export const userRoutes = express.Router();

userRoutes.get("/users", UserController.getUsers);
userRoutes.post("/user", UserController.createUser);
userRoutes.post("/authenticate", UserController.authenticateUser);
userRoutes.post("/create-role", RoleController.createRole);
userRoutes.post("/feature/create-feature", FeatureController.createOrUpdateFeature);
userRoutes.post("/feature/create-role-feature-mapping", FeatureController.createOrUpdateRoleFeatureMapping);
userRoutes.get("/user-features", FeatureController.getUserRoleFeatures);