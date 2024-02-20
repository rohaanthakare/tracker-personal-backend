import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export default class FinancialTransactionModel extends Model {
  id!: number;
  account_id!: number;
  transation_type!: number;
  transaction_amount!: number;
  transaction_date!: Date;
  user_id!: number;
  user_trans_id!: number;
}

export const FinancialTransaction = (sequelize: Sequelize) => {
  FinancialTransactionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
      },
      transation_type: {
        type: DataTypes.INTEGER,
      },
      transaction_amount: {
        type: DataTypes.DOUBLE,
      },
      transaction_date: {
        type: DataTypes.DATE,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      user_trans_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "financial_transactions",
    }
  );

  FinancialTransactionModel.sync();
};

FinancialTransaction(dbconnection);
