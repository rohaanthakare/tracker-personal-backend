import express from "express";
import PasswordController from "./controllers/password-controller";
export const passwordRoutes = express.Router();

passwordRoutes.get("/passwords", PasswordController.getUserPasswords);
passwordRoutes.post("/password", PasswordController.createUserPassword);