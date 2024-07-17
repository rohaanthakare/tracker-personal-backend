import { Logger } from "../../../logger";
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
      depositTransactionDetails.transation_sub_type = depositTransactionDetails.deposit_type;
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
      expenseTransactionDetails.transation_sub_type = expenseTransactionDetails.expense_type;
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
      transferTransactionDetails.transation_sub_type = transferTransactionDetails.transfer_type;
      let userTransDetails = await FinanceService.createUserTransaction(
        transferTransactionDetails
      );
      // Create Account Transaction
      let fromAccountTransDetails = Object.create(transferTransactionDetails);
      fromAccountTransDetails.account = transferTransactionDetails.from_account; 
      fromAccountTransDetails.finance_trans_type = "DEBIT_MONEY";
      fromAccountTransDetails.user_trans_id = userTransDetails.id;
      let accountTransDetailsRes = await FinanceService.createFinancialTransaction(
        fromAccountTransDetails
      );
      // Update Account Balance
      await FinanceService.updateAccountBalance(
        fromAccountTransDetails
      );

      // Create Account Transaction
      let toAccountTransDetails = Object.create(transferTransactionDetails);
      toAccountTransDetails.account = transferTransactionDetails.to_account; 
      toAccountTransDetails.finance_trans_type = "CREDIT_MONEY";
      toAccountTransDetails.user_trans_id = userTransDetails.id;
      let toAccountTransDetailsRes = await FinanceService.createFinancialTransaction(
        toAccountTransDetails
      );
      // Update Account Balance
      await FinanceService.updateAccountBalance(
        toAccountTransDetails
      );
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.moneyTransferWorkflow.name,
        err
      );
      throw err;
    }
  }
}
