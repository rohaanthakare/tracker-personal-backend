import { Logger } from "../../../logger";
import { BankModel } from "../models/bank.model";
import {
  FinancialTransaction,
  FinancialTransactionModel,
} from "../models/financial-transaction.model";

export default class FinanceDataAccessor {
  static async getBankByBankCode(code: string) {
    try {
      let result = await BankModel.findOne({
        where: {
          bank_code: code,
        },
      });
      return result?.toJSON();
    } catch (err: any) {
      Logger.ERROR(
        FinanceDataAccessor.name,
        FinanceDataAccessor.getBankByBankCode.name,
        err
      );
      throw err;
    }
  }

  static async getFinancialTransactionByUserTrans(userTransId: any) {
    try {
      let result = await FinancialTransactionModel.findAll({
        where: {
          user_trans_id: userTransId,
        },
      });
      result = result.map((r) => r.toJSON());
      return result;
    } catch (err: any) {
      Logger.ERROR(
        FinanceDataAccessor.name,
        FinanceDataAccessor.getFinancialTransactionByUserTrans.name,
        `User Transation ID - ${userTransId}`
      );
      Logger.ERROR(
        FinanceDataAccessor.name,
        FinanceDataAccessor.getFinancialTransactionByUserTrans.name,
        err
      );
      throw err;
    }
  }
}
