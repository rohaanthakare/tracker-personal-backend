import {Logger} from "../../../logger";
import MasterDataModel from "../models/master-data.model";
export default class MasterDataDataAccessor {
    static async getMasterDataByCode(code: string) {
        try {
            let result = await MasterDataModel.findOne({
                where: {
                    code: code
                }
            });
            return result;
        } catch (err: any){
            Logger.ERROR(MasterDataDataAccessor.name, MasterDataDataAccessor.getMasterDataByCode.name, err);
            throw err;
        }
    }

    static async getMasterDataByParent(parentCode: string) {
        try {
            let parentData = await MasterDataModel.findOne({
                where: {
                    code: parentCode
                }
            });
            let result = await MasterDataModel.findAll({
                where: {
                    parent_data_id: parentData?.id
                }
            });
            return result;
        } catch (err: any){
            Logger.ERROR(MasterDataDataAccessor.name, MasterDataDataAccessor.getMasterDataByParent.name, err);
            throw err;
        }
    }
}