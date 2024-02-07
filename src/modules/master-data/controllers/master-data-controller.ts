import { Request, Response } from "express";
import { Logger } from "../../../logger";
import MasterDataDataAccessor from "../data-accessors/master-data-data-accessor";
import MasterDataModel from "../models/master-data.model";

export default class MasterDataController {
    static async createOrUpdateMasterData(req: Request, res: Response) {
        try {
            Logger.INFO(MasterDataController.name, MasterDataController.createOrUpdateMasterData.name, "Inside get user passwords");
            let reqBody = req.body;
            let masterDataObj: MasterDataModel = new MasterDataModel();
            masterDataObj.code = reqBody.code;
            masterDataObj.name = reqBody.name;
            masterDataObj.description = reqBody.description;
            masterDataObj.data_icon = reqBody.data_icon;
            if (reqBody.parent_data) {
                let parentData = await MasterDataDataAccessor.getMasterDataByCode(reqBody.parent_data);
                masterDataObj.parent_data_id = parentData?.id as number;
            }
            
            masterDataObj.is_active = reqBody.is_active;
            let masterData = await MasterDataDataAccessor.getMasterDataByCode(reqBody.code);
            let result;
            if (masterData && masterData.dataValues) {
                masterDataObj.dataValues.id = masterData.dataValues.id;
                let updateResult = await MasterDataModel.update(masterDataObj.dataValues, {
                    where: {
                        id: masterData.dataValues.id
                    }
                });

                if (updateResult.length > 0 && updateResult[0] > 0) {
                    result = await MasterDataModel.findByPk(masterDataObj.dataValues.id);
                }
            } else {
                result = await MasterDataModel.create(masterDataObj.dataValues);
            }
            res.status(200).json({
                result,
                message: "Master data created successfully"
            });
        } catch (err: any){
            Logger.ERROR(MasterDataController.name, MasterDataController.createOrUpdateMasterData.name, err);
        }
    }

    static async getMasterDataByParent(req: Request, res: Response) {
        try {
            Logger.INFO(MasterDataController.name, MasterDataController.getMasterDataByParent.name, "Inside get master data by parent");
            let result = await MasterDataDataAccessor.getMasterDataByParent("FINANCE_ACCOUNT_TYPE");
            res.status(200).json({
                data: result,
                message: "Master data created successfully"
            });
        } catch (err: any){
            Logger.ERROR(MasterDataController.name, MasterDataController.getMasterDataByParent.name, err);
        }
    }
}