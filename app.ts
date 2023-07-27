import express, { Express } from "express";
import dotenv from "dotenv";
import log4js from "log4js";

import { Logger } from "./logger";
import {routes} from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Tracker Personal Backend application." });
});

app.use("/api", routes);

app.listen(port, () => {
    Logger.INFO("App","Tracker Personal Backend stated at port - " + port);
})