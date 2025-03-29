import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface IPasswordModel {
  id?: number;
  name?: string;
  site_link?: string;
  username?: string;
  password?: string;
  user_id?: number;
}

export class PasswordModel extends Model {
  id!: number;
  name!: string;
  site_link!: string;
  username!: string;
  password!: string;
  user_id!: number;
}

export const Password = (sequelize: Sequelize) => {
  PasswordModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      site_link: {
        type: DataTypes.STRING(1000),
      },
      username: {
        type: DataTypes.STRING(255),
      },
      password: {
        type: DataTypes.STRING(760),
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "passwords",
    }
  );

  PasswordModel.sync();
};

Password(dbconnection);
