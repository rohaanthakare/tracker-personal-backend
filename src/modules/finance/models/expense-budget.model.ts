import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface IExpenseBudgetModel {
  id?: number;
  user_id?: number;
  expense_category?: number;
  budget?: number;
  yearly_budget?: number;
}

export class ExpenseBudgetModel extends Model {
  id!: number;
  user_id!: number;
  expense_category!: number;
  budget!: number;
  yearly_budget!: number;
}

export const ExpenseBudget = (sequelize: Sequelize) => {
  ExpenseBudgetModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      expense_category: {
        type: DataTypes.INTEGER,
      },
      budget: {
        type: DataTypes.DECIMAL(10, 2),
      },
      yearly_budget: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    {
      sequelize,
      tableName: "expense_budget",
    }
  );

  ExpenseBudgetModel.sync();
};

ExpenseBudget(dbconnection);
