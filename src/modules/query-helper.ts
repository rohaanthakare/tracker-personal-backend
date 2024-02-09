import { Logger } from "../logger";
import dbconnection from "../app-db";
import { QueryTypes } from "sequelize";
export default class QueryHelper {
    static async executeGetQuery(query: string, params: any) {
        Logger.INFO(QueryHelper.name, QueryHelper.executeGetQuery.name, "Inside executeGetQuery");
        let result = await dbconnection.query(query, {
            replacements: params,
            raw: true,
            type: QueryTypes.SELECT
        });
        return result;
    }
}