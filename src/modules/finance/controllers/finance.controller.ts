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
      let userToken = req.tokenData as TokenData;
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
              and trans_cat.id = ut.transation_category 
              and trans_sub_cat.id = ut.transation_sub_category 
              and ut.user_id = (:userid)
            order by ft.transaction_date desc`;

      let queryParams = {
        userid: userToken.user_id,
      };
      let result = await QueryHelper.executeGetQuery(query, queryParams);
      res.status(200).json({
        message: "Financial passbook fetched successfully",
        data: result,
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
      let result = await QueryHelper.executeGetQuery(query, queryParams);
      res.status(200).json({
        message: "Invesment fetched successfully",
        result,
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
}
