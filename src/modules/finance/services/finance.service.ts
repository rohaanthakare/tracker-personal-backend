import { Request, Response } from "express";
import { Logger } from "../../../logger";
import { BankModel, IBankModel } from "../models/bank.model";
import FinanceDataAccessor from "../data-accessors/finance.data-accessor";
import {
  FinancialTransactionModel,
  IFinancialTransactionModel,
} from "../models/financial-transaction.model";
import {
  IUserTransactionModel,
  UserTransactionModel,
} from "../models/user-transaction.model";
import MasterDataDataAccessor from "../../master-data/data-accessors/master-data-data-accessor";
import { FinancialAccountModel, IFinancialAccountModel } from "../models/financial-account.model";
import {
  IInvestmentTransactionModel,
  InvestmentTransactionModel,
} from "../models/investment-transaction.model";
import { InvestmentModel } from "../models/investment.model";

export default class FinanceService {
  static async createOrUpdateBank(bankInputModel: IBankModel) {
    try {
      Logger.INFO(
        FinanceService.name,
        FinanceService.createOrUpdateBank.name,
        "Inside create Bank"
      );
      let bank;
      const bankDetails: IBankModel = bankInputModel;
      let bankDetailRecord = await FinanceDataAccessor.getBankByBankCode(
        bankDetails.bank_code as string
      );
      if (bankDetailRecord) {
        bankDetails.id = bankDetailRecord.id;
        let result = await BankModel.update(bankDetails, {
          where: {
            id: bankDetailRecord.id,
          },
        });

        if (result.length > 0 && result[0] > 0) {
          bank = await BankModel.findByPk(bankDetailRecord.id);
        }
      } else {
        bank = await BankModel.create(bankInputModel as any);
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
      let accountTransModel: IFinancialTransactionModel = {};
      accountTransModel.account_id = accountTransDetailsInput.account;
      let accountTransType = await MasterDataDataAccessor.getMasterDataByCode(
        accountTransDetailsInput.finance_trans_type
      );
      accountTransModel.transaction_type = accountTransType?.id as number;
      accountTransModel.transaction_amount =
        accountTransDetailsInput.transaction_amount;
      accountTransModel.transaction_date = new Date(
        accountTransDetailsInput.transaction_date
      );
      accountTransModel.user_id = accountTransDetailsInput.user_id;
      accountTransModel.user_trans_id = accountTransDetailsInput.user_trans_id;
      let accountTransDetails = await FinancialTransactionModel.create(
        accountTransModel as any
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
      let userTransactionModel: IUserTransactionModel = {};
      userTransactionModel.transaction_amount =
        userTransDetailsInput.transaction_amount;
      let transType = await MasterDataDataAccessor.getMasterDataByCode(
        userTransDetailsInput.user_trans_type
      );
      userTransactionModel.transation_category = transType?.id as number;
      userTransactionModel.transation_sub_category =
        userTransDetailsInput.transation_sub_type;
      userTransactionModel.transaction_date = new Date(
        userTransDetailsInput.transaction_date
      );
      userTransactionModel.transaction_description =
        userTransDetailsInput.transaction_description;
      userTransactionModel.user_id = userTransDetailsInput.user_id;
      let userTransDetails = await UserTransactionModel.create(
        userTransactionModel as any
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

  static async createInvestmentTransaction(investmentTransDetailsInput: any) {
    try {
      Logger.INFO(
        FinanceService.name,
        FinanceService.createInvestmentTransaction.name,
        "Inside create investment transaction"
      );
      let investmentTransModel: IInvestmentTransactionModel = {};
      investmentTransModel.investment_id =
        investmentTransDetailsInput.investment;
      let investmentTransType =
        await MasterDataDataAccessor.getMasterDataByCode(
          investmentTransDetailsInput.investment_trans_type
        );
      investmentTransModel.transaction_type = investmentTransType?.id as number;
      investmentTransModel.transaction_amount =
        investmentTransDetailsInput.transaction_amount;
      investmentTransModel.transaction_date = new Date(
        investmentTransDetailsInput.transaction_date
      );
      investmentTransModel.user_id = investmentTransDetailsInput.user_id;
      investmentTransModel.transaction_desc =
        investmentTransDetailsInput.transaction_description;
      investmentTransModel.user_trans_id =
        investmentTransDetailsInput.user_trans_id;
      let accountTransDetails = await InvestmentTransactionModel.create(
        investmentTransModel as any
      );
      return accountTransDetails;
    } catch (err: any) {
      Logger.ERROR(
        FinanceService.name,
        FinanceService.createInvestmentTransaction.name,
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
      let accountDetailsObj = accountDetails?.toJSON();
      let newAccountBalance = 0;
      if (transDetails.finance_trans_type === "CREDIT_MONEY") {
        // Add to balance
        newAccountBalance =
          parseFloat(accountDetailsObj?.account_balance) + transDetails.transaction_amount;
      } else if (accountDetailsObj) {
        // Remove from balance
        newAccountBalance =
          parseFloat(accountDetailsObj?.account_balance) - transDetails.transaction_amount;
      }
      if (accountDetailsObj) {
        accountDetailsObj.account_balance = newAccountBalance;
        let newAccountDetails = await FinancialAccountModel.update(
          accountDetailsObj,
          {
            where: {
              id: accountDetailsObj.id,
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

  static async updateInvestmentAmount(transDetails: any) {
    try {
      Logger.INFO(
        FinanceService.name,
        FinanceService.updateInvestmentAmount.name,
        "Inside update investment amount"
      );
      let investmentDetails = await InvestmentModel.findByPk(
        transDetails.investment
      );
      let investmentDetailsObj = investmentDetails?.toJSON();
      let newInvestmentAmount = 0;
      if (transDetails.investment_trans_type === "INVEST_MONEY") {
        // Add to balance
        console.log("INVEST----->", investmentDetailsObj?.investment_amount);
        console.log("INVEST----->", transDetails.transaction_amount);
        newInvestmentAmount =
          investmentDetailsObj?.investment_amount +
          transDetails.transaction_amount;
      }
      if (investmentDetailsObj) {
        console.log("NEW-INVEST----->", newInvestmentAmount);
        investmentDetailsObj.investment_amount = newInvestmentAmount;
        console.log("NEW-INVEST----->", newInvestmentAmount);
        let newInvestmentDetails = await InvestmentModel.update(
          investmentDetailsObj,
          {
            where: {
              id: investmentDetailsObj.id,
            },
          }
        );
        return newInvestmentDetails;
      }
    } catch (err: any) {
      Logger.ERROR(
        FinanceService.name,
        FinanceService.updateInvestmentAmount.name,
        err
      );
      throw err;
    }
  }
}
