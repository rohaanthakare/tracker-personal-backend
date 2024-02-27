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

  static async addExpenseWorkflow(depositTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.addExpenseWorkflow.name,
        "Inside addExpenseWorkflow"
      );
      // Create User Transaction
      depositTransactionDetails.user_trans_type = "EXPENSE";
      let userTransDetails = await FinanceService.createUserTransaction(
        depositTransactionDetails
      );
      // Create Account Transaction
      depositTransactionDetails.finance_trans_type = "DEBIT_MONEY";
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
        FinanceWorkflow.addExpenseWorkflow.name,
        err
      );
      throw err;
    }
  }
}
