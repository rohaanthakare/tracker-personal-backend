import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface IFinancialProfileModel {
  id?: number;
  user_id?: number;
  monthly_income?: number;
  monthly_expense_threshold?: number;
  savings_threshold?: number;
  yearly_investment_target?: number;
}

export class FinancialProfileModel extends Model {
  id!: number;
  user_id!: number;
  monthly_income!: number;
  monthly_expense_threshold!: number;
  savings_threshold!: number;
  yearly_investment_target!: number;
}

export const FinancialProfile = (sequelize: Sequelize) => {
  FinancialProfileModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      monthly_income: {
        type: DataTypes.DECIMAL(10, 2),
      },
      monthly_expense_threshold: {
        type: DataTypes.DECIMAL(10, 2),
      },
      savings_threshold: {
        type: DataTypes.DECIMAL(10, 2),
      },
      yearly_investment_target: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      sequelize,
      tableName: "financial_profile",
    }
  );

  FinancialProfileModel.sync();
};

FinancialProfile(dbconnection);
