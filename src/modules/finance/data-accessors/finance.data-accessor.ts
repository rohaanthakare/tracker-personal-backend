import moment from "moment";
import { Logger } from "../../../logger";
import { BankModel } from "../models/bank.model";
import {
  FinancialTransaction,
  FinancialTransactionModel,
} from "../models/financial-transaction.model";
import { LoanTransactionModel } from "../models/loan-transaction.model";
import { Op } from "sequelize";
import MasterDataDataAccessor from "../../master-data/data-accessors/master-data-data-accessor";

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

  static async getLoanTransactionDoneInCurrentMonth() {
    try {
      const startOfMonth = moment().startOf("month").toDate();
      const endOfMonth = moment().endOf("month").toDate();
      Logger.TRACE(
        FinanceDataAccessor.name,
        FinanceDataAccessor.getLoanTransactionDoneInCurrentMonth.name,
        `Getting loan repayments done from ${startOfMonth} to ${endOfMonth}`
      );
      let masterData = await MasterDataDataAccessor.getMasterDataByCode(
        "LOAN_REPAYMENT"
      );
      let loanRepaymentId = masterData.id;
      let result = await LoanTransactionModel.findAll({
        where: {
          transaction_date: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
          transaction_type: loanRepaymentId,
        },
      });
      result = result.map((r) => r.toJSON());
      return result;
    } catch (err: any) {
      Logger.ERROR(
        FinanceDataAccessor.name,
        FinanceDataAccessor.getLoanTransactionDoneInCurrentMonth.name,
        err
      );
      throw err;
    }
  }
}
