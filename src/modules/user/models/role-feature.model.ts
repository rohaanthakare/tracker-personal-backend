import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface IRoleFeatureModel {
  id?: number;
  role_id?: number;
  feature_id?: number;
}

export class RoleFeatureModel extends Model {
  id!: number;
  role_id!: number;
  feature_id!: number;
}

export const RoleFeature = (sequelize: Sequelize) => {
  RoleFeatureModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      feature_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "role_features",
    }
  );

  RoleFeatureModel.sync();
};

RoleFeature(dbconnection);
