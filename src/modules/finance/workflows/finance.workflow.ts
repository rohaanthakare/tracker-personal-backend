import moment from "moment";
import { Logger } from "../../../logger";
import MasterDataDataAccessor from "../../master-data/data-accessors/master-data-data-accessor";
import {
  IMasterDataModel,
  MasterDataModel,
} from "../../master-data/models/master-data.model";
import FinanceDataAccessor from "../data-accessors/finance.data-accessor";
import { IFinancialTransactionModel } from "../models/financial-transaction.model";
import { LoanAccountModel } from "../models/loan-account.model";
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

  static async closeInvestmentWorkflow(investmentTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.closeInvestmentWorkflow.name,
        "Inside closeInvestmentWorkflow"
      );

      let userTransObj: any = {};
      userTransObj.transaction_amount =
        investmentTransactionDetails.transaction_amount;
      userTransObj.transaction_date =
        investmentTransactionDetails.transaction_date;
      userTransObj.transaction_description =
        investmentTransactionDetails.transaction_description;
      userTransObj.user_id = investmentTransactionDetails.user_id;
      userTransObj.user_trans_type = "DEPOSIT";
      userTransObj.investment = investmentTransactionDetails.investment;
      let transSubCatObj = await MasterDataDataAccessor.getMasterDataByCode(
        "INVESTMENT_RETURN"
      );
      userTransObj.transation_sub_type = transSubCatObj.id;
      let userTransaction = await FinanceService.createUserTransaction(
        userTransObj
      );
      if (investmentTransactionDetails.account) {
        // If account create finance trans CREDIT_MONEY
        // Create Account Transaction
        userTransObj.finance_trans_type = "CREDIT_MONEY";
        userTransObj.user_trans_id = userTransaction.id;
        userTransObj.account = investmentTransactionDetails.account;
        let accountTransDetails =
          await FinanceService.createFinancialTransaction(userTransObj);
        // Update Account Balance
        let accountDetails = await FinanceService.updateAccountBalance(
          userTransObj
        );
      }
      // create inverment transaction
      // update investment amount to 0 and maturity amount;
      userTransObj.account = investmentTransactionDetails.account;
      userTransObj.investment_trans_type = "WIHTDRAW_INVESTMENT_MONEY";
      let invTransDetailsRes = await FinanceService.createInvestmentTransaction(
        userTransObj
      );
      // // Update investment amount
      await FinanceService.updateInvestmentAmount(userTransObj);
      // if close investment update status to INVESTMENT_CLOSED
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.closeInvestmentWorkflow.name,
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
        userTransDetails.transaction_sub_category;
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

  static async loanRepaymentWorkflow(loanTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.loanRepaymentWorkflow.name,
        "Inside loanRepaymentWorkflow"
      );
      // Create User Transaction
      loanTransactionDetails.user_trans_type = "EXPENSE";
      loanTransactionDetails.transaction_amount =
        loanTransactionDetails.loan_payment;
      // Sub Type will be invetment type
      let loanTransSubCategory =
        await MasterDataDataAccessor.getMasterDataByCode("LOAN_REPAYMENT");
      loanTransactionDetails.transation_sub_type = loanTransSubCategory.id;
      let userTransDetails = await FinanceService.createUserTransaction(
        loanTransactionDetails
      );
      // Create Loan Transaction
      loanTransactionDetails.loan_id = loanTransactionDetails.id;
      delete loanTransactionDetails.id;
      loanTransactionDetails.loan_trans_type = "LOAN_REPAYMENT";
      loanTransactionDetails.user_trans_id = userTransDetails.id;
      await FinanceService.createLoanTransaction(loanTransactionDetails);
      // Update loan outstanding amount
      await FinanceService.updateLoanOutstandingAmount(loanTransactionDetails);
      if (loanTransactionDetails.transaction_account) {
        // If account is selected create account Transaction
        // If account is selected update account balance
        // Create Account Transaction
        loanTransactionDetails.finance_trans_type = "DEBIT_MONEY";
        loanTransactionDetails.account =
          loanTransactionDetails.transaction_account;
        loanTransactionDetails.user_trans_id = userTransDetails.id;
        let accountTransDetails =
          await FinanceService.createFinancialTransaction(
            loanTransactionDetails
          );
        // Update Account Balance
        let accountDetails = await FinanceService.updateAccountBalance(
          loanTransactionDetails
        );
      }
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.loanRepaymentWorkflow.name,
        err
      );
      throw err;
    }
  }

  static async creditLoanInterestWorkflow() {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.creditLoanInterestWorkflow.name,
        "Inside creditLoanInterestWorkflow"
      );
      // Get all loan repayment transactions done in current month
      let allTrans =
        await FinanceDataAccessor.getLoanTransactionDoneInCurrentMonth();
      let loanTransMap: any = {};
      const currentMonth = moment().month();
      // Get current year
      const currentYear = moment().year();

      // Check if it's a leap year
      const isLeapYear = moment([currentYear]).isLeapYear();

      // Get number of days
      const daysInYear = isLeapYear ? 366 : 365;
      for (const t of allTrans) {
        // await allTrans.forEach(async (t: any) => {
        if (!loanTransMap[t.loan_id]) {
          let loanDetails = await LoanAccountModel.findByPk(t.loan_id);
          loanDetails = loanDetails?.dataValues;
          if (loanDetails) {
            let loanObj: any = {
              loan_id: t.loan_id,
              openingBalance: loanDetails.loan_opening_balance,
              annualRate: loanDetails.annual_rate_of_interest,
              payments: [],
              month: currentMonth,
              year: currentYear,
              yearDays: daysInYear,
            };
            let transObj = {
              date: moment(t.transaction_date).format("YYYY-MM-DD"),
              amount: t.transaction_amount,
            };
            loanObj.payments.push(transObj);
            loanTransMap[t.loan_id] = loanObj;
          }
        } else {
          let transObj = {
            date: moment(t.transaction_date).format("YYYY-MM-DD"),
            amount: t.transaction_amount,
          };
          loanTransMap[t.loan_id].payments.push(transObj);
        }
      }
      for (const loanObj of Object.values(loanTransMap) as any) {
        Logger.TRACE(
          FinanceWorkflow.name,
          FinanceWorkflow.creditLoanInterestWorkflow.name,
          `Loan credit interest for loan ${loanObj?.loan_id}`
        );
        let interestToCredit =
          await FinanceWorkflow.calculateLoanInterestWithPayments(loanObj);
        // Create Loan Credit Transaction
        let loanTransObj: any = {};
        loanTransObj.transaction_amount = interestToCredit;
        loanTransObj.loan_payment = interestToCredit;
        loanTransObj.transaction_date = moment();
        loanTransObj.transaction_description = `Interest for ${currentMonth}-${currentYear}`;
        loanTransObj.loan_trans_type = "LOAN_INTEREST";
        loanTransObj.loan_id = loanObj?.loan_id;
        await FinanceService.createLoanTransaction(loanTransObj);
        // Update loan outstanding amount
        // Update loan outstanding and opening balance
        await FinanceService.updateLoanOutstandingAmount(loanTransObj);
      }
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.creditLoanInterestWorkflow.name,
        err
      );
      throw err;
    }
  }

  static async manualCreditLoanInterestWorkflow(inputLoanTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.manualCreditLoanInterestWorkflow.name,
        "Inside manualCreditLoanInterestWorkflow"
      );

      // Create Loan Credit Transaction
      let loanTransObj: any = {};
      loanTransObj.transaction_amount = inputLoanTransactionDetails.interest_amount;
      loanTransObj.loan_payment = inputLoanTransactionDetails.interest_amount;
      loanTransObj.transaction_date = inputLoanTransactionDetails.transaction_date;
      loanTransObj.transaction_description = inputLoanTransactionDetails.transaction_description;
      loanTransObj.loan_trans_type = "LOAN_INTEREST";
      loanTransObj.loan_id = inputLoanTransactionDetails?.id;
      await FinanceService.createLoanTransaction(loanTransObj);
      // Update loan outstanding amount
      // Update loan outstanding and opening balance
      await FinanceService.updateLoanOutstandingAmount(loanTransObj);
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.creditLoanInterestWorkflow.name,
        err
      );
      throw err;
    }
  }

  static async closeLoanWorkflow(loanTransactionDetails: any) {
    try {
      Logger.INFO(
        FinanceWorkflow.name,
        FinanceWorkflow.closeLoanWorkflow.name,
        "Inside closeLoanWorkflow"
      );
      // Create User Transaction
      loanTransactionDetails.user_trans_type = "EXPENSE";
      loanTransactionDetails.transaction_amount =
        loanTransactionDetails.outstanding_loan_amount;
      // Sub Type will be invetment type
      let loanTransSubCategory =
        await MasterDataDataAccessor.getMasterDataByCode("LOAN_REPAYMENT");
      loanTransactionDetails.transation_sub_type = loanTransSubCategory.id;
      let userTransDetails = await FinanceService.createUserTransaction(
        loanTransactionDetails
      );
      // Create Loan Transaction
      loanTransactionDetails.loan_id = loanTransactionDetails.id;
      delete loanTransactionDetails.id;
      loanTransactionDetails.loan_trans_type = "LOAN_REPAYMENT";
      loanTransactionDetails.user_trans_id = userTransDetails.id;
      await FinanceService.createLoanTransaction(loanTransactionDetails);
      // Update loan outstanding amount
      await LoanAccountModel.update({
          is_loan_active: false,
          outstanding_loan_amount: 0,
          loan_opening_balance: 0,
        },
        {
          where: {
            id: loanTransactionDetails.loan_id,
          },
        });
      if (loanTransactionDetails.transaction_account) {
        // If account is selected create account Transaction
        // If account is selected update account balance
        // Create Account Transaction
        loanTransactionDetails.finance_trans_type = "DEBIT_MONEY";
        loanTransactionDetails.account =
          loanTransactionDetails.transaction_account;
        loanTransactionDetails.user_trans_id = userTransDetails.id;
        let accountTransDetails =
          await FinanceService.createFinancialTransaction(
            loanTransactionDetails
          );
        // Update Account Balance
        let accountDetails = await FinanceService.updateAccountBalance(
          loanTransactionDetails
        );
      }
    } catch (err: any) {
      Logger.ERROR(
        FinanceWorkflow.name,
        FinanceWorkflow.closeLoanWorkflow.name,
        err
      );
      throw err;
    }
  }

  static calculateLoanInterestWithPayments(loanDetails: any) {
    const year = loanDetails.year;
    const month = loanDetails.month;
    const annualRate = loanDetails.annualRate;
    const yearDays = loanDetails.yearDays;
    const openingBalance = loanDetails.openingBalance;
    let payments = loanDetails.payments;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const interestPerDayRate = annualRate / (100 * yearDays);

    // Create map of date → balance change
    const paymentMap: any = {};
    for (const payment of payments) {
      const day = new Date(payment.date).getDate();
      paymentMap[day] = (paymentMap[day] || 0) + payment.amount;
    }

    let balance = openingBalance;
    let totalInterest = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      // If any payment is made that day, reduce balance first
      if (paymentMap[day]) {
        balance -= paymentMap[day];
      }

      const dailyInterest = balance * interestPerDayRate;
      totalInterest += dailyInterest;
    }

    return Number(totalInterest.toFixed(0));
  }
}
