import express from "express";
import FinanceController from "./controllers/finance.controller";
export const financeRoutes = express.Router();

financeRoutes.post("/finance/bank", FinanceController.createOrUpdateBank);
financeRoutes.get("/finance/banks", FinanceController.getBanks);
financeRoutes.post("/finance/financial-account", FinanceController.createFinancialAccount);
financeRoutes.get("/finance/financial-accounts", FinanceController.createFinancialAccount);