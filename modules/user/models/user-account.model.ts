import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export default class UserAccountModel extends Model {
    id!: number;
    username!: string;
    password!: string;
    email!: string;
    mobile_no!: number;
    current_role!: number;
}

export const UserAccount = (sequelize: Sequelize) => {
    UserAccountModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: {
            type: DataTypes.STRING(760)
        },
        email: {
            type: DataTypes.STRING(255),
            unique: true
        },
        mobile_no: {
            type: DataTypes.BIGINT,
            unique: true
        },
        current_role: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        tableName: "user_accounts"
    });

    UserAccountModel.sync();
}

UserAccount(dbconnection);