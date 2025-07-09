import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface ILoanAccountModel {
  id?: number;
  name?: string;
  lender?: string;
  loan_type?: number;
  loan_amount?: number;
  loan_tenure_months?: number;
  loan_start_date?: number;
  annual_rate_of_interest?: number;
  loan_emi?: number;
  outstanding_loan_amount?: number;
  loan_opening_balance?: number;
  is_loan_active?: boolean;
  user_id?: number;
}

export class LoanAccountModel extends Model {
  id!: number;
  name!: string;
  lender!: string;
  loan_type!: number;
  loan_amount!: number;
  loan_tenure_months!: number;
  loan_start_date!: number;
  annual_rate_of_interest!: number;
  loan_emi!: number;
  outstanding_loan_amount!: number;
  loan_opening_balance!: number;
  is_loan_active!: boolean;
  user_id!: number;
}

export const LoanAccount = (sequelize: Sequelize) => {
  LoanAccountModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      lender: {
        type: DataTypes.STRING,
      },
      loan_type: {
        type: DataTypes.INTEGER,
      },
      loan_amount: {
        type: DataTypes.DECIMAL(10, 2),
      },
      loan_tenure_months: {
        type: DataTypes.INTEGER,
      },
      loan_start_date: {
        type: DataTypes.DATE,
      },
      annual_rate_of_interest: {
        type: DataTypes.FLOAT,
      },
      loan_emi: {
        type: DataTypes.DECIMAL(10, 2),
      },
      outstanding_loan_amount: {
        type: DataTypes.DECIMAL(10, 2),
      },
      loan_opening_balance: {
        type: DataTypes.DECIMAL(10, 2),
      },
      is_loan_active: {
        type: DataTypes.BOOLEAN,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "loan_accounts",
    }
  );

  LoanAccountModel.sync();
};

LoanAccount(dbconnection);
