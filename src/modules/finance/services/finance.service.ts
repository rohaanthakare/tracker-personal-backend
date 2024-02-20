import { Request, Response } from "express";
import { Logger } from "../../../logger";
import BankModel from "../models/bank.model";
import FinanceDataAccessor from "../data-accessors/finance.data-accessor";
import FinancialTransactionModel from "../models/financial-transaction.model";
import UserTransactionModel from "../models/user-transaction.model";
import MasterDataDataAccessor from "../../master-data/data-accessors/master-data-data-accessor";
import FinancialAccountModel from "../models/financial-account.model";

export default class FinanceService {
  static async createOrUpdateBank(bankInputModel: BankModel) {
    try {
      Logger.INFO(
        FinanceService.name,
        FinanceService.createOrUpdateBank.name,
        "Inside create Bank"
      );
      let bank;
      const bankDetails = bankInputModel.dataValues;
      let bankDetailRecord = await FinanceDataAccessor.getBankByBankCode(
        bankDetails.bank_code
      );
      if (bankDetailRecord?.dataValues) {
        bankDetails.id = bankDetailRecord.dataValues.id;
        let result = await BankModel.update(bankDetails, {
          where: {
            id: bankDetailRecord.dataValues.id,
          },
        });

        if (result.length > 0 && result[0] > 0) {
          bank = await BankModel.findByPk(bankDetailRecord.dataValues.id);
        }
      } else {
        bank = await BankModel.create(bankDetails);
      }
      return bank;
    } catch (err: any) {
      Logger.ERROR(
        FinanceService.name,
        FinanceService.createOrUpdateBank.name,
        err
      );
      throw err;
    }
  }

  static async createFinancialTransaction(accountTransDetailsInput: any) {
    try {
      Logger.INFO(
        FinanceService.name,
        FinanceService.createFinancialTransaction.name,
        "Inside create financial transaction"
      );
      let accountTransModel: FinancialTransactionModel =
        new FinancialTransactionModel();
      accountTransModel.account_id = accountTransDetailsInput.account;
      let accountTransType = await MasterDataDataAccessor.getMasterDataByCode(
        accountTransDetailsInput.finance_trans_type
      );
      accountTransModel.transation_type = accountTransType?.id as number;
      accountTransModel.transaction_amount =
        accountTransDetailsInput.transaction_amount;
      accountTransModel.transaction_date = new Date(
        accountTransDetailsInput.transaction_date
      );
      accountTransModel.user_id = accountTransDetailsInput.user_id;
      accountTransModel.user_trans_id = accountTransDetailsInput.user_trans_id;
      let accountTransDetails = await FinancialTransactionModel.create(
        accountTransModel.dataValues
      );
      return accountTransDetails;
    } catch (err: any) {
      Logger.ERROR(
        FinanceService.name,
        FinanceService.createFinancialTransaction.name,
        err
      );
      throw err;
    }
  }

  static async createUserTransaction(userTransDetailsInput: any) {
    try {
      Logger.INFO(
        FinanceService.name,
        FinanceService.createUserTransaction.name,
        "Inside create user transaction"
      );
      let userTransactionModel: UserTransactionModel =
        new UserTransactionModel();
      userTransactionModel.transaction_amount =
        userTransDetailsInput.transaction_amount;
      let transType = await MasterDataDataAccessor.getMasterDataByCode(
        userTransDetailsInput.user_trans_type
      );
      userTransactionModel.transation_category = transType?.id as number;
      userTransactionModel.transation_sub_category =
        userTransDetailsInput.deposit_type;
      userTransactionModel.transaction_date = new Date(
        userTransDetailsInput.transaction_date
      );
      userTransactionModel.transaction_description =
        userTransDetailsInput.transaction_description;
      userTransactionModel.user_id = userTransDetailsInput.user_id;
      let userTransDetails = await UserTransactionModel.create(
        userTransactionModel.dataValues
      );
      return userTransDetails;
    } catch (err: any) {
      Logger.ERROR(
        FinanceService.name,
        FinanceService.createUserTransaction.name,
        err
      );
      throw err;
    }
  }

  static async updateAccountBalance(transDetails: any) {
    try {
      Logger.INFO(
        FinanceService.name,
        FinanceService.updateAccountBalance.name,
        "Inside create Bank"
      );
      let accountDetails = await FinancialAccountModel.findByPk(
        transDetails.account
      );
      let newAccountBalance = 0;
      if (transDetails.finance_trans_type === "CREDIT_MONEY") {
        // Add to balance
        newAccountBalance =
          accountDetails?.account_balance + transDetails.transaction_amount;
      } else {
        // Remove from balance
      }
      if (accountDetails) {
        accountDetails.dataValues.account_balance = newAccountBalance;
        let newAccountDetails = await FinancialAccountModel.update(
          accountDetails.dataValues,
          {
            where: {
              id: accountDetails.id,
            },
          }
        );
        return newAccountDetails;
      }
    } catch (err: any) {
      Logger.ERROR(
        FinanceService.name,
        FinanceService.updateAccountBalance.name,
        err
      );
      throw err;
    }
  }
}
