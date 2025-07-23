import { Request, Response } from "express";
import { Logger } from "../../../logger";
import { BankModel, IBankModel } from "../models/bank.model";
import FinanceService from "../services/finance.service";
import {
  FinancialAccountModel,
  IFinancialAccountModel,
} from "../models/financial-account.model";
import { TokenData } from "../../../../types/express";
import QueryHelper from "../../query-helper";
import FinanceWorkflow from "../workflows/finance.workflow";
import MasterDataDataAccessor from "../../master-data/data-accessors/master-data-data-accessor";
import { IInvestmentModel, InvestmentModel } from "../models/investment.model";
import { FinancialProfileModel } from "../models/financial-profile.model";
import { ExpenseBudgetModel } from "../models/expense-budget.model";
import {
  ILoanAccountModel,
  LoanAccountModel,
} from "../models/loan-account.model";

export default class FinanceController {
  static async createOrUpdateBank(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.createOrUpdateBank.name,
        "Inside create Bank"
      );
      let reqBody = req.body;
      let bank: IBankModel = {};
      bank.bank_code = reqBody.bank_code;
      bank.name = reqBody.name;
      bank.bank_logo = reqBody.bank_logo;
      let result = await FinanceService.createOrUpdateBank(bank);
      res.status(201).json({
        message: "Bank created successfully",
        result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.createOrUpdateBank.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getBanks(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getBanks.name,
        "Inside create Bank"
      );
      let result = await BankModel.findAll();
      result = result.map((r) => r.toJSON());
      res.status(200).json({
        message: "Banks list fetched successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getBanks.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async createFinancialAccount(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.createFinancialAccount.name,
        "Inside create financial account"
      );
      let reqBody = req.body;
      let userToken = req.tokenData as TokenData;
      let financeAccountModel: IFinancialAccountModel = {};
      financeAccountModel.name = reqBody.name;
      financeAccountModel.account_type = reqBody.account_type;
      financeAccountModel.bank_id = reqBody.bank;
      financeAccountModel.account_balance = 0;
      financeAccountModel.user_id = userToken.user_id;
      let result = await FinancialAccountModel.create(
        financeAccountModel as any
      );

      res.status(201).json({
        message: "Financial account created successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.createFinancialAccount.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getFinancialAccounts(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getFinancialAccounts.name,
        "Inside get user financial accounts"
      );
      let userToken = req.tokenData as TokenData;
      let query =
        "select acc.*, (select name from banks where banks.id = acc.bank_id) as bank_name, (select name from master_data ac_tp where ac_tp.id = acc.account_type) as account_type_display from financial_accounts acc where user_id = (:userid)";
      let queryParams = {
        userid: userToken.user_id,
      };
      let result = await QueryHelper.executeGetQuery(query, queryParams);

      res.status(200).json({
        message: "Financial account created successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getFinancialAccounts.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }
  static async getAllFinancialAccounts(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getAllFinancialAccounts.name,
        "Inside get user financial accounts"
      );
      let userToken = req.tokenData as TokenData;
      let result = await FinancialAccountModel.findAll({
        where: {
          user_id: userToken.user_id,
        },
      });
      result = result.map((r) => r.toJSON());
      res.status(200).json({
        message: "Financial account created successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getAllFinancialAccounts.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async depositMoney(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.depositMoney.name,
        "Inside deposit money"
      );
      let depositTransDetails = req.body;
      let userToken = req.tokenData as TokenData;
      depositTransDetails.user_id = userToken.user_id;
      let result = await FinanceWorkflow.depositMoneyWorkflow(
        depositTransDetails
      );
      res.status(201).json({
        message: "Financial account created successfully",
        data: {},
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.depositMoney.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getFinancialPassbook(req: Request, res: Response) {
    try {
      Logger.TRACE(
        FinanceController.name,
        FinanceController.getFinancialPassbook.name,
        "Inside getFinancialPassbook"
      );
      let start = req.query.start ? req.query.start : 0;
      let limit = req.query.limit ? req.query.limit : 10;
      let userToken = req.tokenData as TokenData;
      let countQuery = `select count(*) as total_records
            from financial_transactions ft, user_transactions ut 
            where ft.user_trans_id = ut.id  
            and ut.user_id = (:userid)`;

      let query = `select ft.*,
            trans_cat.name as transaction_category_display,
            trans_sub_cat.name as transaction_sub_category_display,
            trans_type.code as transaction_type_code,
            fa.name as transaction_account_display,
            ut.transaction_description as transaction_description
            from financial_transactions ft, user_transactions ut, financial_accounts fa, master_data trans_type, master_data trans_cat, master_data trans_sub_cat 
            where ft.user_trans_id = ut.id 
              and ft.account_id = fa.id 
              and trans_type.id = ft.transaction_type 
              and trans_cat.id = ut.transaction_category 
              and trans_sub_cat.id = ut.transaction_sub_category 
              and ut.user_id = (:userid)
            order by ft.transaction_date desc, ft.createdAt desc`;

      let queryParams = {
        userid: userToken.user_id,
      };
      let pagingParams = {
        limit: parseInt(limit as any),
        offset: parseInt(start as any),
      };
      let reportResult = await QueryHelper.executeReportGetQuery(
        query,
        countQuery,
        queryParams,
        pagingParams
      );
      res.status(200).json({
        message: "Financial passbook fetched successfully",
        data: reportResult.data,
        total: reportResult.total,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getFinancialPassbook.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async addExpense(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.addExpense.name,
        "Inside add expense"
      );
      let depositTransDetails = req.body;
      let userToken = req.tokenData as TokenData;
      depositTransDetails.user_id = userToken.user_id;
      let result = await FinanceWorkflow.addExpenseWorkflow(
        depositTransDetails
      );
      res.status(201).json({
        message: "Expense added successfully",
        data: {},
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.addExpense.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async transferMoney(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.transferMoney.name,
        "Inside money transfer"
      );
      let transferTransDetails = req.body;
      let userToken = req.tokenData as TokenData;
      transferTransDetails.user_id = userToken.user_id;
      let result = await FinanceWorkflow.moneyTransferWorkflow(
        transferTransDetails
      );
      res.status(201).json({
        message: "Money transfered successfully",
        data: {},
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.transferMoney.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getFinancialInvestments(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getFinancialInvestments.name,
        "Inside get invesments"
      );
      let userToken = req.tokenData as TokenData;
      let start = req.query.start ? req.query.start : 0;
      let limit = req.query.limit ? req.query.limit : 10;

      let countQuery = `select count(*) as total_investments 
        from investments i
        where i.user_id = (:userid)`;

      let query = `select i.*, inv_tp.code as investment_type_code, inv_tp.name as investment_type_display,
        inv_stat.code as investment_status_code, inv_stat.name as investment_status_display from investments i, 
        master_data inv_tp,
        master_data inv_stat
        where inv_tp.id = i.investment_type
        and inv_stat.id = i.investment_status
        and i.user_id = (:userid)`;

      let queryParams = {
        userid: userToken.user_id,
      };
      let pagingParams = {
        limit: parseInt(limit as any),
        offset: parseInt(start as any),
      };
      let reportResult = await QueryHelper.executeReportGetQuery(
        query,
        countQuery,
        queryParams,
        pagingParams
      );

      res.status(200).json({
        message: "Invesment fetched successfully",
        data: reportResult.data,
        total: reportResult.total,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.addExpense.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async createInvestment(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.createInvestment.name,
        "Inside create investment"
      );

      let investmentStatusData =
        await MasterDataDataAccessor.getMasterDataByCode("INVESTMENT_ACTIVE");
      let userToken = req.tokenData as TokenData;
      let investmentObj: IInvestmentModel = {};
      investmentObj.name = req.body.name;
      investmentObj.investment_type = req.body.investment_type;
      investmentObj.investment_amount = 0;
      investmentObj.investment_maturity_amount = 0;
      investmentObj.is_investment_has_locking = req.body
        .is_investment_has_locking
        ? req.body.is_investment_has_locking
        : false;
      investmentObj.user_id = userToken.user_id;
      investmentObj.investment_start_date = req.body.investment_start_date;
      investmentObj.investment_status = investmentStatusData.id;
      let result = await InvestmentModel.create(investmentObj as any);
      res.status(201).json({
        message: "Invesment created successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.addExpense.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getInvestmentStatement(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getInvestmentStatement.name,
        "Inside get investment statement"
      );
      const investment_id = req.params.investment_id;
      let start = req.query.start ? req.query.start : 0;
      let limit = req.query.limit ? req.query.limit : 10;
      let userToken = req.tokenData as TokenData;
      let countQuery = `select count(*) as total_loan_accounts
            from investment_transaction inv_trans 
            where inv_trans.investment_id = :investment_id`;

      let query = `select inv_trans.*, tr_tp.code as trans_type_code, tr_tp.name as trans_type_display 
      from investment_transaction inv_trans, master_data tr_tp 
      where inv_trans.investment_id = :investment_id 
      and tr_tp.id = inv_trans.transaction_type`;

      let queryParams = {
        investment_id: investment_id,
      };
      let pagingParams = {
        limit: parseInt(limit as any),
        offset: parseInt(start as any),
      };
      let reportResult = await QueryHelper.executeReportGetQuery(
        query,
        countQuery,
        queryParams,
        pagingParams
      );
      res.status(200).json({
        message: "Investment passbook fetched successfully",
        data: reportResult.data,
        total: reportResult.total,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getInvestmentStatement.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async investMoney(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.investMoney.name,
        "Inside invest money"
      );

      let investmentTransDetails = req.body;
      let userToken = req.tokenData as TokenData;
      investmentTransDetails.user_id = userToken.user_id;
      let result = await FinanceWorkflow.investMoneyWorkflow(
        investmentTransDetails
      );
      res.status(201).json({
        message: "Money Invested successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.investMoney.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async closeInvetment(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.closeInvetment.name,
        "Inside closeInvetment"
      );

      let investmentTransDetails = req.body;
      let userToken = req.tokenData as TokenData;
      investmentTransDetails.user_id = userToken.user_id;
      let result = await FinanceWorkflow.closeInvestmentWorkflow(
        investmentTransDetails
      );
      res.status(201).json({
        message: "Investment closed successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.closeInvetment.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async withdrawInvestmentMoney(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.withdrawInvestmentMoney.name,
        "Inside withdrawInvestmentMoney"
      );

      let investmentTransDetails = req.body;
      let userToken = req.tokenData as TokenData;
      investmentTransDetails.user_id = userToken.user_id;
      investmentTransDetails.trans_type = "WIHTDRAW_INVESTMENT_MONEY";
      let result = await FinanceWorkflow.closeInvestmentWorkflow(
        investmentTransDetails
      );
      res.status(201).json({
        message: "Investment closed successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.withdrawInvestmentMoney.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getAllFinancialInvestments(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getAllFinancialInvestments.name,
        "Inside get all investments"
      );
      let userToken = req.tokenData as TokenData;
      let result = await InvestmentModel.findAll({
        where: {
          user_id: userToken.user_id,
        },
      });
      result = result.map((r) => r.toJSON());
      res.status(200).json({
        message: "Financial investments fetched successfully",
        data: result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getAllFinancialInvestments.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getFinancialOverview(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getFinancialOverview.name,
        "Inside get all investments"
      );
      let userToken = req.tokenData as TokenData;
      const user_id = userToken.user_id;

      let result = await InvestmentModel.findAll({
        where: {
          user_id: userToken.user_id,
        },
      });
      result = result.map((r) => r.toJSON());

      let totalSavingsQuery = `select sum(account_balance) as total_savings from financial_accounts fa
                    where fa.user_id = (:userid)`;
      let totalSavingsQueryParams = {
        userid: userToken.user_id,
      };
      let totalSavingsResult: any = await QueryHelper.executeGetQuery(
        totalSavingsQuery,
        totalSavingsQueryParams
      );
      let financeOverview: any = {};
      if (totalSavingsResult && totalSavingsResult.length > 0) {
        financeOverview.total_savings = totalSavingsResult[0].total_savings
          ? totalSavingsResult[0].total_savings
          : 0;
      }

      let totalInvestmentsQuery = `select sum(i.investment_amount) as total_investments from investments i, master_data md 
                                where i.investment_status = md.id
                                and md.code = "INVESTMENT_ACTIVE"
                                and i.user_id = (:userid)`;
      let totalInvestmentsQueryParams = {
        userid: userToken.user_id,
      };
      let totalInvestmentsResult: any = await QueryHelper.executeGetQuery(
        totalInvestmentsQuery,
        totalInvestmentsQueryParams
      );
      if (totalInvestmentsResult && totalInvestmentsResult.length > 0) {
        financeOverview.total_investments = totalInvestmentsResult[0]
          .total_investments
          ? totalInvestmentsResult[0].total_investments
          : 0;
      }

      let monthlyExpenseQuery = `select sum(ut.transaction_amount) as monthly_expense from user_transactions ut, master_data trans_cat
                                  where ut.transaction_category = trans_cat.id
                                  and trans_cat.code = "EXPENSE"
                                  and MONTH(ut.transaction_date) = MONTH(CURRENT_DATE())
                                  and (ut.is_reverted != 1 OR ut.is_reverted is null)
                                  and ut.user_id = (:userid)`;
      let monthlyExpenseQueryParams = {
        userid: userToken.user_id,
      };
      let monthlyExpenseResult: any = await QueryHelper.executeGetQuery(
        monthlyExpenseQuery,
        monthlyExpenseQueryParams
      );
      if (monthlyExpenseResult && monthlyExpenseResult.length > 0) {
        financeOverview.monthly_expense = monthlyExpenseResult[0]
          .monthly_expense
          ? monthlyExpenseResult[0].monthly_expense
          : 0;
      }

      let expenseHistoryQuery = `select MONTH(ut.transaction_date) as expense_month, 
        DATE_FORMAT(ut.transaction_date, '%b') as expense_month_string, 
        YEAR(ut.transaction_date) as expense_year, 
        sum(ut.transaction_amount) as monthly_expense from user_transactions ut, master_data trans_cat
        where ut.transaction_category = trans_cat.id
        and trans_cat.code = "EXPENSE"
        and ut.user_id = (:userid)
        and (ut.is_reverted != 1 OR ut.is_reverted is null)
        group by MONTH(ut.transaction_date), DATE_FORMAT(ut.transaction_date, '%b'), YEAR(ut.transaction_date)
        order by YEAR(ut.transaction_date), MONTH(ut.transaction_date) asc`;

      let expenseHistoryQueryParams = {
        userid: userToken.user_id,
      };
      let expenseHistoryResult: any = await QueryHelper.executeGetQuery(
        expenseHistoryQuery,
        expenseHistoryQueryParams
      );
      if (expenseHistoryResult && expenseHistoryResult.length > 0) {
        financeOverview.expense_history = expenseHistoryResult;
      } else {
        financeOverview.expense_history = [];
      }

      let monthlyExpenseSplitQuery = `select trans_sub_cat.code as expense_type_code, trans_sub_cat.name as expense_type_name ,
        sum(ut.transaction_amount) as expense_amount from user_transactions ut, master_data trans_cat,
        master_data trans_sub_cat
        where user_id = (:userid)
        and trans_cat.id = ut.transaction_category
        and trans_cat.code = "EXPENSE"
        and ut.transaction_sub_category = trans_sub_cat.id
        and MONTH(ut.transaction_date) = MONTH(CURRENT_DATE())
        group by trans_sub_cat.code`;

      let monthlyExpenseSplitQueryParams = {
        userid: userToken.user_id,
      };
      let monthlyExpenseSplitResult: any = await QueryHelper.executeGetQuery(
        monthlyExpenseSplitQuery,
        monthlyExpenseSplitQueryParams
      );
      if (monthlyExpenseSplitResult && monthlyExpenseSplitResult.length > 0) {
        financeOverview.monthly_expense_split = monthlyExpenseSplitResult;
      } else {
        financeOverview.monthly_expense_split = [];
      }

      let totalBorrowingsQuery = `select sum(loan_amount) as total_loan, sum(outstanding_loan_amount) as total_outstanding_loan 
      from loan_accounts where user_id = (:userid)`;
      let totalBorrowingsQueryParams = {
        userid: userToken.user_id,
      };
      let totalBorrowingsResult: any = await QueryHelper.executeGetQuery(
        totalBorrowingsQuery,
        totalBorrowingsQueryParams
      );
      if (totalBorrowingsResult && totalBorrowingsResult.length > 0) {
        financeOverview.total_loan = totalBorrowingsResult[0].total_loan
          ? parseFloat(totalBorrowingsResult[0].total_loan)
          : 0;
        financeOverview.total_outstanding_loan = totalBorrowingsResult[0]
          .total_outstanding_loan
          ? parseFloat(totalBorrowingsResult[0].total_outstanding_loan)
          : 0;
      }

      let financialProfile = await FinancialProfileModel.findOne({
        where: {
          user_id: userToken.user_id,
        }
      });

      financeOverview.financialProfile = financialProfile?.dataValues;

      let currentYearInvestmentQuery = `select sum(it.transaction_amount) as current_year_investment 
        from investment_transaction it 
        where it.investment_id in (
          select id from investments i where i.user_id = (:userid)
        )
        and year(it.transaction_date) = year(current_date())`;
      let currentYearInvestmentQueryParams = {
        userid: userToken.user_id,
      };
      let currentYearInvestmentResult: any = await QueryHelper.executeGetQuery(
        currentYearInvestmentQuery,
        currentYearInvestmentQueryParams
      );
      if (currentYearInvestmentResult && currentYearInvestmentResult.length > 0) {
        financeOverview.current_year_investment  = currentYearInvestmentResult[0].current_year_investment
          ? parseFloat(currentYearInvestmentResult[0].current_year_investment)
          : 0;
      }

      let weekWiseExpenseHistoryQuery = `select WEEK(transaction_date, 1) as transaction_week, sum(transaction_amount) as expense_amount
      from user_transactions ut
      where user_id = (:userid) 
      and transaction_category in (select id from master_data where code = 'EXPENSE') 
      and YEAR(ut.transaction_date) = YEAR(CURRENT_DATE())
      group by WEEK(transaction_date, 1)`;
      let weekWiseExpenseHistoryQueryParams = {
        userid: userToken.user_id,
      };
      let weekWiseExpenseHistoryResult: any = await QueryHelper.executeGetQuery(
        weekWiseExpenseHistoryQuery,
        weekWiseExpenseHistoryQueryParams
      );
      financeOverview.weekWiseExpenseHistory = [];
      if (weekWiseExpenseHistoryResult && weekWiseExpenseHistoryResult.length > 0) {
        financeOverview.weekWiseExpenseHistory = Array.from(weekWiseExpenseHistoryResult);
      }

      res.status(200).json({
        message: "Financial overview fetched successfully",
        financeOverview,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getFinancialOverview.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getYearlyExpenseByCategory(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getYearlyExpenseByCategory.name,
        "Inside getYearlyExpenseByCategory"
      );
      let userToken = req.tokenData as TokenData;
      const user_id = userToken.user_id;

      let yearlyExpenseByCategory: any;
      let yearlyExpenseQuery = `select trans_sub_cat.id as expense_category_id, 
        trans_sub_cat.code as expense_category_code, 
        trans_sub_cat.name as expense_category_name, 
        sum(ut.transaction_amount) as expense_amount from user_transactions ut, master_data trans_cat,
        master_data trans_sub_cat
        where ut.user_id = :userid
        and trans_cat.id = ut.transaction_category
        and trans_cat.code = "EXPENSE"
        and trans_sub_cat.id = ut.transaction_sub_category
        and YEAR(ut.transaction_date) = YEAR(CURRENT_DATE())
        group by trans_sub_cat.id, trans_sub_cat.code`;

      let yearlyExpenseQueryParams = {
        userid: userToken.user_id,
      };
      let yearlyExpenseResult: any = await QueryHelper.executeGetQuery(
        yearlyExpenseQuery,
        yearlyExpenseQueryParams
      );
      if (yearlyExpenseResult && yearlyExpenseResult.length > 0) {
        yearlyExpenseByCategory = yearlyExpenseResult;
      } else {
        yearlyExpenseByCategory = [];
      }
      res.status(200).json({
        message: "Yearly Expense fetched successfully",
        result: yearlyExpenseByCategory,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getYearlyExpenseByCategory.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async createFinancialProfile(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.createFinancialProfile.name,
        "Inside create financial profile"
      );

      let financialProfileDetails = req.body;
      let userToken = req.tokenData as TokenData;
      financialProfileDetails.user_id = userToken.user_id;
      if (financialProfileDetails.id) {
        let result = await FinancialProfileModel.update(
          financialProfileDetails,
          {
            where: {
              id: financialProfileDetails.id,
            },
          }
        );
      } else {
        let result = await FinancialProfileModel.create(
          financialProfileDetails
        );
      }
      res.status(201).json({
        message: "Financial profile created successfully",
        data: {},
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.createFinancialProfile.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getFinancialProfile(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getFinancialProfile.name,
        "Inside get financial profile"
      );
      let userToken = req.tokenData as TokenData;
      let result = await FinancialProfileModel.findOne({
        where: {
          user_id: userToken.user_id,
        },
      });
      let financialProfile = result?.toJSON();
      res.status(200).json({
        message: "Financial profile fetched successfully",
        financialProfile,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getAllFinancialInvestments.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async createOrUpdateExpenseBudget(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.createOrUpdateExpenseBudget.name,
        "Inside create or update expense budget"
      );

      let expenseBudgetDetails = req.body;
      let userToken = req.tokenData as TokenData;
      // expenseBudgetDetails.user_id = userToken.user_id;
      await ExpenseBudgetModel.destroy({
        where: {
          user_id: userToken.user_id,
        },
      });
      await expenseBudgetDetails.forEach((e: any) => {
        e.expense_category = e.id;
        e.budget = e.expense_budget;
        e.yearly_budget = e.expense_budget * 12;
        delete e.id;
        e.user_id = userToken.user_id;
      });
      let result = await ExpenseBudgetModel.bulkCreate(expenseBudgetDetails);
      res.status(201).json({
        message: "Expense budget created successfully",
        result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.createOrUpdateExpenseBudget.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getExpenseBudget(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getExpenseBudget.name,
        "Inside get expense budget"
      );
      let userToken = req.tokenData as TokenData;
      let result = await ExpenseBudgetModel.findAll({
        where: {
          user_id: userToken.user_id,
        },
      });
      result = result.map((r) => r.toJSON());
      res.status(200).json({
        message: "Expense budget details fetched successfully",
        result,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getAllFinancialInvestments.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async revertTransaction(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.revertTransaction.name,
        "Inside revertTransaction"
      );

      let transactionDetails = req.body;
      let result = await FinanceWorkflow.revertTransactionWorkflow(
        transactionDetails
      );
      res.status(201).json({
        message: "Transaction reverted successfully",
        data: {},
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.revertTransaction.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async getLoans(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.getLoans.name,
        "Inside getLoans"
      );
      let start = req.query.start ? req.query.start : 0;
      let limit = req.query.limit ? req.query.limit : 10;
      let userToken = req.tokenData as TokenData;
      let countQuery = `select count(*) as total_loan_accounts
            from loan_accounts la 
            where la.user_id = :userid`;

      let query = `select la.*, lt.code as loan_type_code,
        lt.name as loan_type_display 
      from loan_accounts la, master_data lt
      where la.loan_type = lt.id
        and la.user_id = :userid`;

      let queryParams = {
        userid: userToken.user_id,
      };
      let pagingParams = {
        limit: parseInt(limit as any),
        offset: parseInt(start as any),
      };
      let reportResult = await QueryHelper.executeReportGetQuery(
        query,
        countQuery,
        queryParams,
        pagingParams
      );
      res.status(200).json({
        message: "Financial passbook fetched successfully",
        data: reportResult.data,
        total: reportResult.total,
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.getLoans.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async createLoan(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.createLoan.name,
        "Inside createLoan"
      );
      let userToken = req.tokenData as TokenData;
      let loanDetails = req.body;
      let loanObj: ILoanAccountModel = {};
      loanObj.annual_rate_of_interest = loanDetails.annual_rate_of_interest;
      loanObj.lender = loanDetails.lender;
      loanObj.loan_amount = loanDetails.loan_amount;
      loanObj.loan_emi = loanDetails.loan_emi;
      loanObj.loan_start_date = loanDetails.loan_start_date;
      loanObj.loan_tenure_months = loanDetails.loan_tenure_months;
      loanObj.loan_type = loanDetails.loan_type;
      loanObj.name = loanDetails.name;
      loanObj.outstanding_loan_amount = loanDetails.outstanding_loan_amount;
      loanObj.loan_opening_balance = loanDetails.outstanding_loan_amount;
      loanObj.is_loan_active = true;
      loanObj.user_id = userToken.user_id;
      let result = await LoanAccountModel.create(loanObj as any);
      res.status(200).json({
        message: "Loans created successfully",
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.createLoan.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async updateLoan(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.createLoan.name,
        "Inside createLoan"
      );

      let userToken = req.tokenData as TokenData;
      let loanDetails = req.body;
      let loanId = req.params.loan_id;
      let loanObj: ILoanAccountModel = {};
      loanObj.annual_rate_of_interest = loanDetails.annual_rate_of_interest;
      loanObj.lender = loanDetails.lender;
      loanObj.loan_amount = loanDetails.loan_amount;
      loanObj.loan_emi = loanDetails.loan_emi;
      loanObj.loan_start_date = loanDetails.loan_start_date;
      loanObj.loan_tenure_months = loanDetails.loan_tenure_months;
      loanObj.loan_type = loanDetails.loan_type;
      loanObj.name = loanDetails.name;
      loanObj.outstanding_loan_amount = loanDetails.outstanding_loan_amount;
      loanObj.loan_opening_balance = loanDetails.outstanding_loan_amount;
      let result = await LoanAccountModel.update(loanObj as any, {
        where: {
          id: loanId,
        },
      });
      res.status(200).json({
        message: "Loans created successfully",
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.createLoan.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }

  static async loanRepayment(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.loanRepayment.name,
        "Inside loanRepayment"
      );
      let userToken = req.tokenData as TokenData;
      let loanTransactionDetails = req.body;
      let result = await FinanceWorkflow.loanRepaymentWorkflow(
        loanTransactionDetails
      );
      res.status(200).json({
        message: "Loan repayment done successfully",
      });
    } catch (err: any) {
      Logger.ERROR(
        FinanceController.name,
        FinanceController.loanRepayment.name,
        err
      );
      res.status(500).json({
        message: err,
      });
    }
  }
}
