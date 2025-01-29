import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export default class InvestmentModel extends Model {
    id!: number;
    name!: string;
    investment_type!: number;
    investment_amount!: number;
    investment_maturity_amount!: number;
    investment_status!: number;
    investment_start_date!: Date;
    investment_close_date!: Date;
    is_investment_has_locking!: boolean;
    user_id!: number;
}

export const Investment = (sequelize: Sequelize) => {
    InvestmentModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        investment_type: {
            type: DataTypes.INTEGER
        },
        investment_amount: {
            type: DataTypes.DOUBLE
        },
        investment_maturity_amount: {
            type: DataTypes.DOUBLE
        },
        investment_status: {
            type: DataTypes.INTEGER
        },
        investment_start_date: {
            type: DataTypes.DATE
        },
        investment_close_date: {
            type: DataTypes.DATE
        },
        is_investment_has_locking: {
            type: DataTypes.BOOLEAN
        },
        user_id: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        tableName: "investments"
    });

    InvestmentModel.sync();
}

Investment(dbconnection);