import { DataTypes, Model, Sequelize } from "sequelize";
import dbconnection from "../../../app-db";

export default class MasterDataModel extends Model {
    id!: number;
    code!: string;
    name!: string;
    description!: string;
    data_icon!: string;
    parent_data_id!: number;
    is_active!: boolean;
}

export const MasterData = (sequelize: Sequelize) => {
    MasterDataModel.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        code: {
            type : DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING(760)
        },
        data_icon: {
            type: DataTypes.STRING
        },
        parent_data_id: {
            type: DataTypes.INTEGER
        },
        is_active: {
            type: DataTypes.BOOLEAN
        }        
    }, {
        sequelize,
        tableName: "master_data"
    });

    MasterDataModel.sync();
}

MasterData(dbconnection)