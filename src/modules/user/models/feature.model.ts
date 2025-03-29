import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export interface IFeatureModel {
  id?: number;
  feature_code?: string;
  feature_name?: string;
  description?: string;
  is_active?: boolean;
  parent_feature_id?: number;
  feature_type?: string;
  feature_icon?: string;
  feature_url?: string;
}

export class FeatureModel extends Model {
  id!: number;
  feature_code!: string;
  feature_name!: string;
  description!: string;
  is_active!: boolean;
  parent_feature_id!: number;
  feature_type!: string;
  feature_icon!: string;
  feature_url!: string;
}

export const Feature = (sequelize: Sequelize) => {
  FeatureModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      feature_code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      feature_name: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING(760),
      },
      is_active: {
        type: DataTypes.BOOLEAN,
      },
      parent_feature_id: {
        type: DataTypes.INTEGER,
      },
      feature_type: {
        type: DataTypes.ENUM("SIDE_NAV", "TOOLBAR", "ROW_LEVEL", "BULK"),
      },
      feature_icon: {
        type: DataTypes.STRING,
      },
      feature_url: {
        type: DataTypes.STRING(760),
      },
    },
    {
      sequelize,
      tableName: "features",
    }
  );

  FeatureModel.sync();
};

Feature(dbconnection);
