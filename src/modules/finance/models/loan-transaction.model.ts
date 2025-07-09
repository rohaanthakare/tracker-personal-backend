import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface ILoanTransactionModel {
  id?: number;
  transaction_amount?: number;
  transaction_date?: Date;
  transaction_description?: string;
  transaction_type?: number;
  loan_id?: number;
  user_trans_id?: number;
  user_id?: number;
}

export class LoanTransactionModel extends Model {
  id!: number;
  transaction_amount!: number;
  transaction_date!: Date;
  transaction_description!: string;
  transaction_type!: number;
  loan_id!: number;
  user_trans_id!: number;
  user_id!: number;
}

export const LoanTransaction = (sequelize: Sequelize) => {
  LoanTransactionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transaction_amount: {
        type: DataTypes.DECIMAL(10, 2),
      },
      transaction_date: {
        type: DataTypes.DATE,
      },
      transaction_description: {
        type: DataTypes.STRING,
      },
      transaction_type: {
        type: DataTypes.INTEGER,
      },
      loan_id: {
        type: DataTypes.INTEGER,
      },
      user_trans_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "loan_transactions",
    }
  );

  LoanTransactionModel.sync();
};

LoanTransaction(dbconnection);
