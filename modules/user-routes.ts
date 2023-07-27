import express, {Request, Response} from "express";
import { Logger } from "../logger";
export const userRoutes = express.Router();

userRoutes.get("/users", (req: Request, res: Response) => {
    Logger.INFO("UserRoutes", "Inside get users list");
    res.send("Get Users API - In Progress");
});