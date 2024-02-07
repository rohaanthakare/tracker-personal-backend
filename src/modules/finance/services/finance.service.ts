import { Request, Response } from "express";
import { Logger } from "../../../logger";
import BankModel from "../models/bank.model";
import FinanceDataAccessor from "../data-accessors/finance.data-accessor";

export default class FinanceService {
    static async createOrUpdateBank(bankInputModel: BankModel) {
        try {
            Logger.INFO(FinanceService.name, FinanceService.createOrUpdateBank.name, "Inside create Bank");
            let bank;
            const bankDetails = bankInputModel.dataValues;
            let bankDetailRecord = await FinanceDataAccessor.getBankByBankCode(bankDetails.bank_code);
            if (bankDetailRecord?.dataValues) {
                bankDetails.id = bankDetailRecord.dataValues.id;
                let result = await BankModel.update(bankDetails, {
                    where: {
                        id: bankDetailRecord.dataValues.id
                    }
                });

                if (result.length > 0 && result[0] > 0) {
                    bank = await BankModel.findByPk(bankDetailRecord.dataValues.id);
                }
            } else {
                bank = await BankModel.create(bankDetails);
            }
            return bank;
        } catch (err: any){
            Logger.ERROR(FinanceService.name, FinanceService.createOrUpdateBank.name, err);
            throw err;
        }
    }
}