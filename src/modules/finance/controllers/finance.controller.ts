import { Request, Response } from "express";
import { Logger } from "../../../logger";
import BankModel from "../models/bank.model";
import FinanceService from "../services/finance.service";
import FinancialAccountModel, { FinancialAccount } from "../models/financial-account.model";

export default class FinanceController {
    static async createOrUpdateBank(req: Request, res: Response) {
        try {
            Logger.INFO(FinanceController.name, FinanceController.createOrUpdateBank.name, "Inside create Bank");
            let reqBody = req.body;
            let bank: BankModel = new BankModel();
            bank.bank_code = reqBody.bank_code;
            bank.name = reqBody.name;
            bank.bank_logo = reqBody.bank_logo;
            let result = await FinanceService.createOrUpdateBank(bank);
            res.status(201).json({
                message: "Bank created successfully",
                result
            });
        } catch (err: any){
            Logger.ERROR(FinanceController.name, FinanceController.createOrUpdateBank.name, err);
            res.status(500).json({
                message: err
            });
        }
    }

    static async getBanks(req: Request, res: Response) {
        try {
            Logger.INFO(FinanceController.name, FinanceController.createOrUpdateBank.name, "Inside create Bank");
            let result = await BankModel.findAll();
            res.status(200).json({
                message: "Banks list fetched successfully",
                data: result
            });
        } catch (err: any){
            Logger.ERROR(FinanceController.name, FinanceController.createOrUpdateBank.name, err);
            res.status(500).json({
                message: err
            });
        }
    }

    static async createFinancialAccount(req: Request, res: Response) {
        try {
            Logger.INFO(FinanceController.name, FinanceController.createFinancialAccount.name, "Inside create financial account");
            let reqBody = req.body;
            let financeAccountModel: FinancialAccountModel = new FinancialAccountModel();
            financeAccountModel.name = reqBody.name;
            financeAccountModel.account_type = reqBody.account_type;
            financeAccountModel.bank_id = reqBody.bank;
            let result = await FinancialAccountModel.create(financeAccountModel.dataValues);
            
            res.status(201).json({
                message: "Financial account created successfully",
                data: result
            });
        } catch (err: any){
            Logger.ERROR(FinanceController.name, FinanceController.createOrUpdateBank.name, err);
            res.status(500).json({
                message: err
            });
        }
    }

    static async getFinancialAccounts(req: Request, res: Response) {
        try {
            Logger.INFO(FinanceController.name, FinanceController.createFinancialAccount.name, "Inside create financial account");
            let reqBody = req.body;
            let financeAccountModel: FinancialAccountModel = new FinancialAccountModel();
            financeAccountModel.name = reqBody.name;
            financeAccountModel.account_type = reqBody.account_type;
            financeAccountModel.bank_id = reqBody.bank;
            let result = await FinancialAccountModel.create(financeAccountModel.dataValues);
            
            res.status(201).json({
                message: "Financial account created successfully",
                data: result
            });
        } catch (err: any){
            Logger.ERROR(FinanceController.name, FinanceController.createOrUpdateBank.name, err);
            res.status(500).json({
                message: err
            });
        }
    }
}