import express from "express";

import { userRoutes } from "./modules/user/user-routes";
import CoreController from "./modules/core/core-controller";

export const routes = express.Router();

routes.post("/setup", CoreController.setupApplication);
routes.use(userRoutes);