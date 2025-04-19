import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface IUserTransactionModel {
  id?: number;
  transaction_amount?: number;
  transation_category?: number;
  transation_sub_category?: number;
  transaction_date?: Date;
  transaction_description?: string;
  is_reverted?: boolean;
  user_id?: number;
}

export class UserTransactionModel extends Model {
  id!: number;
  transaction_amount!: number;
  transation_category!: number;
  transation_sub_category!: number;
  transaction_date!: Date;
  transaction_description!: string;
  is_reverted!: boolean;
  user_id!: number;
}

export const UserTransaction = (sequelize: Sequelize) => {
  UserTransactionModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      transaction_amount: {
        type: DataTypes.DOUBLE,
      },
      transation_category: {
        type: DataTypes.INTEGER,
      },
      transation_sub_category: {
        type: DataTypes.INTEGER,
      },
      transaction_date: {
        type: DataTypes.DATE,
      },
      transaction_description: {
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      is_reverted: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      tableName: "user_transactions",
    }
  );

  UserTransactionModel.sync();
};

UserTransaction(dbconnection);
