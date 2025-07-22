import { Logger } from "../logger";
import dbconnection from "../app-db";
import { QueryTypes } from "sequelize";
export default class QueryHelper {
  static async executeGetQuery(query: string, params: any) {
    Logger.INFO(
      QueryHelper.name,
      QueryHelper.executeGetQuery.name,
      "Inside executeGetQuery"
    );
    let result = await dbconnection.query(query, {
      replacements: params,
      raw: true,
      type: QueryTypes.SELECT,
    });
    return result;
  }

  static async executeReportGetQuery(
    query: string,
    countQuery: string,
    params?: any,
    pagingParams?: any
  ) {
    Logger.INFO(
      QueryHelper.name,
      QueryHelper.executeGetQuery.name,
      "Inside executeGetQuery"
    );

    let countResult = await dbconnection.query(countQuery, {
      replacements: params,
      raw: true,
      type: QueryTypes.SELECT,
    });

    params.limit = pagingParams.limit;
    params.offset = pagingParams.offset;
    query += ` limit :limit offset :offset`;
    let result = await dbconnection.query(query, {
      replacements: params,
      raw: true,
      type: QueryTypes.SELECT,
    });
    let reportResult = {
      total: 0,
      data: [],
    };
    if (result) {
      reportResult.data = result as any;
    }
    if (countResult && countResult.length > 0) {
      reportResult.total = Object.values(countResult[0])[0] as any;
    }
    return reportResult;
  }
}
