import express from "express";
import UserController from "./user-controller";

export const userRoutes = express.Router();

userRoutes.get("/users", UserController.getUsers);
userRoutes.post("/user", UserController.createUser);
userRoutes.post("/authenticate", UserController.authenticateUser);