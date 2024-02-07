import express from "express";
import MasterDataController from "./controllers/master-data-controller";
export const masterDataRoutes = express.Router();

masterDataRoutes.post("/master-data", MasterDataController.createOrUpdateMasterData);
masterDataRoutes.get("/master-data/get-master-data-by-parent", MasterDataController.getMasterDataByParent);