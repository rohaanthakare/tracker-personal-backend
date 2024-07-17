import express from "express";
import FinanceController from "./controllers/finance.controller";
export const financeRoutes = express.Router();

financeRoutes.post("/finance/bank", FinanceController.createOrUpdateBank);
financeRoutes.get("/finance/banks", FinanceController.getBanks);
financeRoutes.post("/finance/financial-account", FinanceController.createFinancialAccount);
financeRoutes.get("/finance/financial-accounts", FinanceController.getFinancialAccounts);
financeRoutes.get("/finance/get-all-financial-account", FinanceController.getAllFinancialAccounts);
financeRoutes.post("/finance/deposit-money", FinanceController.depositMoney);
financeRoutes.post("/finance/add-expense", FinanceController.addExpense);
financeRoutes.post("/finance/transfer-money", FinanceController.transferMoney);
financeRoutes.get("/finance/get-financial-passbook", FinanceController.getFinancialPassbook);