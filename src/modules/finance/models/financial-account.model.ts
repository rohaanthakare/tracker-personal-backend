import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export default class FinancialAccountModel extends Model {
    id!: number;
    name!: string;
    account_type!: number;
    bank_id!: number;
    branch_id!: number;
    account_balance!: number;
    threshold_balance!: number;
    user_id!: number;
}

export const FinancialAccount = (sequelize: Sequelize) => {
    FinancialAccountModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        account_type: {
            type: DataTypes.INTEGER
        },
        bank_id: {
            type: DataTypes.INTEGER
        },
        branch_id: {
            type: DataTypes.INTEGER
        },
        account_balance: {
            type: DataTypes.FLOAT
        },
        threshold_balance: {
            type: DataTypes.FLOAT
        },
        user_id: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        tableName: "financial_accounts"
    });

    FinancialAccountModel.sync();
}

FinancialAccount(dbconnection);