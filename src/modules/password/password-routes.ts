import express from "express";
import PasswordController from "./controllers/password-controller";
export const passwordRoutes = express.Router();

passwordRoutes.get("/passwords", PasswordController.getUserPasswords);
passwordRoutes.post("/password", PasswordController.createUserPassword);
passwordRoutes.get("/password/:id", PasswordController.getPasswordDetails);
passwordRoutes.put("/password/:id", PasswordController.updateUserPassword);
passwordRoutes.delete("/password/:id", PasswordController.deleteUserPassword);