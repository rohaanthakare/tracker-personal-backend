import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export default class BankModel extends Model {
    id!: number;
    bank_code!: string;
    name!: string;
    bank_logo!: string;
}

export const Bank = (sequelize: Sequelize) => {
    BankModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        bank_code: {
            type: DataTypes.STRING,
            unique: true
        },
        name: {
            type: DataTypes.STRING
        },
        bank_logo: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        tableName: "banks"
    });

    BankModel.sync();
}

Bank(dbconnection);