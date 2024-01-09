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
            Logger.ERROR(MasterDataDataAccessor.name, err);
            throw err;
        }
    }
}