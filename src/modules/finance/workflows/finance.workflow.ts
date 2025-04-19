import { Logger } from "../../../logger";
import MasterDataDataAccessor from "../../master-data/data-accessors/master-data-data-accessor";
import {
  IMasterDataModel,
  MasterDataModel,
} from "../../master-data/models/master-data.model";
import FinanceDataAccessor from "../data-accessors/finance.data-accessor";
import { IFinancialTransactionModel } from "../models/financial-transaction.model";
import {
  IUserTransactionModel,
  UserTransactionModel,
} from "../models/user-transaction.model";
import FinanceService from "../services/finance.service";

export default class FinanceWorkflow {
  static async depositMoneyWorkflow(depositTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.depositMoneyWorkflow.name,
        "Inside depositMoneyWorkflow"
      );
      // Create User Transaction
      depositTransactionDetails.user_trans_type = "DEPOSIT";
      depositTransactionDetails.transation_sub_type =
        depositTransactionDetails.deposit_type;
      let userTransDetails = await FinanceService.createUserTransaction(
        depositTransactionDetails
      );
      // Create Account Transaction
      depositTransactionDetails.finance_trans_type = "CREDIT_MONEY";
      depositTransactionDetails.user_trans_id = userTransDetails.id;
      let accountTransDetails = await FinanceService.createFinancialTransaction(
        depositTransactionDetails
      );
      // Update Account Balance
      let accountDetails = await FinanceService.updateAccountBalance(
        depositTransactionDetails
      );
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.depositMoneyWorkflow.name,
        err
      );
      throw err;
    }
  }

  static async addExpenseWorkflow(expenseTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.addExpenseWorkflow.name,
        "Inside addExpenseWorkflow"
      );
      // Create User Transaction
      expenseTransactionDetails.user_trans_type = "EXPENSE";
      expenseTransactionDetails.transation_sub_type =
        expenseTransactionDetails.expense_type;
      let userTransDetails = await FinanceService.createUserTransaction(
        expenseTransactionDetails
      );
      // Create Account Transaction
      expenseTransactionDetails.finance_trans_type = "DEBIT_MONEY";
      expenseTransactionDetails.user_trans_id = userTransDetails.id;
      let accountTransDetails = await FinanceService.createFinancialTransaction(
        expenseTransactionDetails
      );
      // Update Account Balance
      let accountDetails = await FinanceService.updateAccountBalance(
        expenseTransactionDetails
      );
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.addExpenseWorkflow.name,
        err
      );
      throw err;
    }
  }

  static async moneyTransferWorkflow(transferTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.moneyTransferWorkflow.name,
        "Inside moneyTransferWorkflow"
      );
      // Create User Transaction
      transferTransactionDetails.user_trans_type = "TRANSFER";
      transferTransactionDetails.transation_sub_type =
        transferTransactionDetails.transfer_type;
      let userTransDetails = await FinanceService.createUserTransaction(
        transferTransactionDetails
      );
      // Create Account Transaction
      let fromAccountTransDetails = Object.create(transferTransactionDetails);
      fromAccountTransDetails.account = transferTransactionDetails.from_account;
      fromAccountTransDetails.finance_trans_type = "DEBIT_MONEY";
      fromAccountTransDetails.user_trans_id = userTransDetails.id;
      let accountTransDetailsRes =
        await FinanceService.createFinancialTransaction(
          fromAccountTransDetails
        );
      // Update Account Balance
      await FinanceService.updateAccountBalance(fromAccountTransDetails);

      // Create Account Transaction
      let toAccountTransDetails = Object.create(transferTransactionDetails);
      toAccountTransDetails.account = transferTransactionDetails.to_account;
      toAccountTransDetails.finance_trans_type = "CREDIT_MONEY";
      toAccountTransDetails.user_trans_id = userTransDetails.id;
      let toAccountTransDetailsRes =
        await FinanceService.createFinancialTransaction(toAccountTransDetails);
      // Update Account Balance
      await FinanceService.updateAccountBalance(toAccountTransDetails);
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.moneyTransferWorkflow.name,
        err
      );
      throw err;
    }
  }

  static async investMoneyWorkflow(investmentTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.investMoneyWorkflow.name,
        "Inside moneyTransferWorkflow"
      );
      // Create User Transaction
      investmentTransactionDetails.user_trans_type = "INVEST";
      // Sub Type will be invetment type
      let invTransSubCategory =
        await MasterDataDataAccessor.getMasterDataByCode("INVEST_MONEY");
      investmentTransactionDetails.transation_sub_type = invTransSubCategory.id;
      let userTransDetails = await FinanceService.createUserTransaction(
        investmentTransactionDetails
      );
      // Create Account Transaction - Debit
      if (investmentTransactionDetails.account) {
        let accountTransDetails = Object.create(investmentTransactionDetails);
        accountTransDetails.account = investmentTransactionDetails.account;
        accountTransDetails.finance_trans_type = "DEBIT_MONEY";
        accountTransDetails.user_trans_id = userTransDetails.id;
        await FinanceService.createFinancialTransaction(accountTransDetails);
        // // Update Account Balance
        await FinanceService.updateAccountBalance(accountTransDetails);
      }

      // // Create invetment transaction
      let invTransDetails = Object.create(investmentTransactionDetails);
      invTransDetails.account = investmentTransactionDetails.account;
      invTransDetails.investment_trans_type = "INVEST_MONEY";
      invTransDetails.user_trans_id = userTransDetails.id;
      let invTransDetailsRes = await FinanceService.createInvestmentTransaction(
        invTransDetails
      );
      // // Update investment amount
      await FinanceService.updateInvestmentAmount(invTransDetails);
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.investMoneyWorkflow.name,
        err
      );
      throw err;
    }
  }

  static async revertTransactionWorkflow(transactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.revertTransactionWorkflow.name,
        "Inside revertTransactionWorkflow"
      );
      await UserTransactionModel.update(
        {
          is_reverted: true,
        },
        {
          where: {
            id: transactionDetails.user_trans_id,
          },
        }
      );

      let userTransDetailsModel = await UserTransactionModel.findByPk(
        transactionDetails.user_trans_id
      );
      let userTransDetails = userTransDetailsModel?.toJSON();
      let revertTransType = await MasterDataDataAccessor.getMasterDataByCode(
        "REVERT"
      );
      let financeTransTypeCredit =
        await MasterDataDataAccessor.getMasterDataByCode("CREDIT_MONEY");
      let financeTransTypeDebit =
        await MasterDataDataAccessor.getMasterDataByCode("DEBIT_MONEY");

      let revertUserTransDetails: any = {};
      revertUserTransDetails.is_reverted = true;
      revertUserTransDetails.transaction_amount =
        userTransDetails.transaction_amount;
      revertUserTransDetails.transaction_date = new Date();
      revertUserTransDetails.transaction_description = `REV - ${userTransDetails.transaction_description}`;
      revertUserTransDetails.user_trans_type = "REVERT";
      revertUserTransDetails.transation_sub_type =
        userTransDetails.transation_sub_category;
      revertUserTransDetails.user_id = userTransDetails.user_id;
      let revUserTransDetails = await FinanceService.createUserTransaction(
        revertUserTransDetails
      );
      // Create Account Transaction
      let financialTransactions =
        await FinanceDataAccessor.getFinancialTransactionByUserTrans(
          userTransDetails.id
        );
      financialTransactions.forEach(async (ft: IFinancialTransactionModel) => {
        let revFinanceTransDetails: any = {};
        revFinanceTransDetails.account = ft.account_id;
        revFinanceTransDetails.transaction_amount = ft.transaction_amount;
        revFinanceTransDetails.transaction_date = new Date().toISOString();
        revFinanceTransDetails.user_id = ft.user_id;
        revFinanceTransDetails.user_trans_id = revUserTransDetails.id;
        if (ft.transaction_type === financeTransTypeCredit.id) {
          // Debit
          revFinanceTransDetails.finance_trans_type = "DEBIT_MONEY";
        } else {
          // Credit
          revFinanceTransDetails.finance_trans_type = "CREDIT_MONEY";
        }
        await FinanceService.createFinancialTransaction(revFinanceTransDetails);

        // Update Account Balance
        await FinanceService.updateAccountBalance(revFinanceTransDetails);
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.revertTransactionWorkflow.name,
        err
      );
      throw err;
    }
  }
}
