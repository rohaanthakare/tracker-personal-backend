import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface IRoleModel {
  id?: number;
  role_code?: string;
  role_name?: string;
  description?: string;
}

export class RoleModel extends Model {
  id!: number;
  role_code!: string;
  role_name!: string;
  description!: string;
}

export const Role = async (sequelize: Sequelize) => {
  await RoleModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_code: {
        type: DataTypes.STRING,
        unique: true,
      },
      role_name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING(1234),
      },
    },
    {
      sequelize,
      tableName: "roles",
    }
  );

  await RoleModel.sync();
};

Role(dbconnection);
