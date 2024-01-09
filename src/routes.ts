import express from "express";

import { userRoutes } from "./modules/user/user-routes";
import CoreController from "./modules/core/core-controller";
import { passwordRoutes } from "./modules/password/password-routes";
import { masterDataRoutes } from "./modules/master-data/master-data-routes";

export const routes = express.Router();

routes.post("/setup", CoreController.setupApplication);
routes.get("/application-data-modules-to-load", CoreController.getApplicationDataModulesToLoad);
routes.get("/module-data-to-load", CoreController.getModuleDataToLoad);
routes.use(userRoutes);
routes.use(passwordRoutes);
routes.use(masterDataRoutes);
export const ROUTES_WIHTOUT_AUTH = ['/api/setup', '/api/authenticate', '/api/register_user', '/api/activate_user', '/api/activate_by_otp',
    '/api/reset_password', '/api/send_reset_pass_link'];