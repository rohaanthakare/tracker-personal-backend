import express from "express";

import { userRoutes } from "./modules/user-routes";

export const routes = express.Router();

routes.use(userRoutes);