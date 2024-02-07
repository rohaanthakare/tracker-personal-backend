import { Request, Response } from "express";
import { Logger } from "../../../logger";

export default class FinanceWorkflow {
    static async createBank(req: Request, res: Response) {
        try {
            Logger.INFO(FinanceWorkflow.name, "Inside create Bank")
            res.status(201).json({
                message: "Bank created successfully",
            });
        } catch (err: any){
            Logger.ERROR(FinanceWorkflow.name, err);
            res.status(500).json({
                message: err
            });
        }
    }
}