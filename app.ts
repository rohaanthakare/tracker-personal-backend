require("dotenv").config({ override: true });
import express, { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { json, urlencoded } from "body-parser";
import cors from "cors";

import { Logger } from "./src/logger";
import { ROUTES_WIHTOUT_AUTH, routes } from "./src/routes";
import dbconnection from "./src/app-db";
import { TokenData } from "./types/express";
import SchedulerService from "./src/modules/core/scheduler.service";

const app: Express = express();
app.use(json());
app.use(cors());
app.use(
  urlencoded({
    extended: true,
  })
);
const port = process.env.APP_PORT || 4000;

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tracker Personal Backend application." });
});

app.use(function (req: Request, res: Response, next) {
  if (ROUTES_WIHTOUT_AUTH.includes(req.originalUrl)) {
    next();
  } else {
    let token = req.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    if (token) {
      jwt.verify(token, process.env.TOKEN_KEY as string, (err, decoded) => {
        if (err) {
          return res.status(403).json({
            status: false,
            message: "Token is invalid",
          });
        } else {
          req.tokenData = decoded as TokenData;
          next();
        }
      });
      app.use("/api", routes);
    } else {
      return res.status(401).json({
        status: false,
        message: "Auth token in not supplied",
      });
    }
  }
});

app.use("/api", routes);

dbconnection
  .sync()
  .then(() => {
    Logger.INFO("App", "DBCONNECTION","Tracker Personal database connected successfully");
  })
  .catch((err) => {
    Logger.ERROR("App", "DBCONNECTION", err);
  });
app.listen(port, () => {
  Logger.INFO("App", "APP-LISTEN", "Tracker Personal Backend stated at port - " + port);
  const schedulerInstance = new SchedulerService();
});
