import { Request, Response } from "express";
import { Logger } from "../../../logger";
import BankModel from "../models/bank.model";
import FinanceService from "../services/finance.service";
import FinancialAccountModel, {
  FinancialAccount,
} from "../models/financial-account.model";
import { TokenData } from "../../../../types/express";
import QueryHelper from "../../query-helper";
import FinanceWorkflow from "../workflows/finance.workflow";

export default class FinanceController {
  static async createOrUpdateBank(req: Request, res: Response) {
    try {
      Logger.INFO(
        FinanceController.name,
        FinanceController.createOrUpdateBank.name,
        "Inside create Bank"
      );
      let reqBody = req.body;
      let bank: BankModel = new BankModel();
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
      let financeAccountModel: FinancialAccountModel =
        new FinancialAccountModel();
      financeAccountModel.name = reqBody.name;
      financeAccountModel.account_type = reqBody.account_type;
      financeAccountModel.bank_id = reqBody.bank;
      financeAccountModel.account_balance = 0;
      financeAccountModel.user_id = userToken.user_id;
      let result = await FinancialAccountModel.create(
        financeAccountModel.dataValues
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
      Logger.INFO(
        FinanceController.name,
        FinanceController.getFinancialPassbook.name,
        "Inside getFinancialPassbook"
      );
      let userToken = req.tokenData as TokenData;
      let query = `select ut.*,
            (select name from master_data tr_ct where tr_ct.id = ut.transation_category) as transaction_category_display,
            (select name from master_data tr_sub_ct where tr_sub_ct.id = ut.transation_sub_category) as transaction_sub_category_display,
            (select name from financial_transactions ft_from, financial_accounts fa_from where fa_from.id = ft_from.account_id and ft_from.user_trans_id = ut.id) as from_account_display
            from user_transactions ut
            where ut.user_id = (:userid)`;
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
}
