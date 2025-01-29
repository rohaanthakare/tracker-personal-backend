import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export default class InvestmentTransactionModel extends Model {
    id!: number;
    transaction_amount!: number;
    transaction_date!: Date;
    transaction_desc!: string;
    transaction_type!: number;
    investment_id!: number;
    user_id!: number;
}

export const InvestmentTransaction = (sequelize: Sequelize) => {
    InvestmentTransactionModel.init({
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        transaction_amount: {
            type: DataTypes.DOUBLE
        },
        transaction_date: {
            type: DataTypes.DATE
        },
        transaction_desc: {
            type: DataTypes.STRING
        },
        transaction_type: {
            type: DataTypes.INTEGER
        },
        investment_id: {
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        tableName: "investment_transaction"
    });
}

InvestmentTransaction(dbconnection);