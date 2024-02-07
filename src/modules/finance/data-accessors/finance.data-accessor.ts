import {Logger} from "../../../logger";
import BankModel from "../models/bank.model";

export default class FinanceDataAccessor {
    static async getBankByBankCode(code: string) {
        try {
            let result = await BankModel.findOne({
                where: {
                    bank_code: code
                }
            });
            return result;
        } catch (err: any){
            Logger.ERROR(FinanceDataAccessor.name, FinanceDataAccessor.getBankByBankCode.name, err);
            throw err;
        }
    }
}