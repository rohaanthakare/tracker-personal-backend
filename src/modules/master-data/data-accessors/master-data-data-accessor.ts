import { Logger } from "../../../logger";
import { MasterDataModel } from "../models/master-data.model";
export default class MasterDataDataAccessor {
  static async getMasterDataByCode(code: string) {
    try {
      let result = await MasterDataModel.findOne({
        where: {
          code: code,
        },
      });
      return result?.toJSON();
    } catch (err: any) {
      Logger.ERROR(
        MasterDataDataAccessor.name,
        MasterDataDataAccessor.getMasterDataByCode.name,
        err
      );
      throw err;
    }
  }

  static async getMasterDataByParent(parentCode: string) {
    try {
      let parentData = await MasterDataModel.findOne({
        where: {
          code: parentCode,
        },
      });
      let parentDataObj = parentData?.toJSON();
      let result = await MasterDataModel.findAll({
        where: {
          parent_data_id: parentDataObj.id,
        },
      });
      result = result.map((r) => r.toJSON());
      return result;
    } catch (err: any) {
      Logger.ERROR(
        MasterDataDataAccessor.name,
        MasterDataDataAccessor.getMasterDataByParent.name,
        err
      );
      throw err;
    }
  }
}
