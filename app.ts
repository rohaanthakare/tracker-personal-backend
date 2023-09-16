require('dotenv').config({ override: true })
import express, { Express } from "express";
import {json, urlencoded} from "body-parser";

import { Logger } from "./logger";
import { routes } from "./routes";
import dbconnection from "./app-db";

const app: Express = express();
app.use(json());
app.use(urlencoded({
    extended: true
}));
const port = process.env.APP_PORT || 4000;

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Tracker Personal Backend application." });
});

app.use("/api", routes);


dbconnection.sync().then(() => {
    Logger.INFO("App","Tracker Personal database connected successfully");
}).catch((err) => {
    Logger.ERROR("App",err);
});
app.listen(port, () => {
    Logger.INFO("App","Tracker Personal Backend stated at port - " + port);
});