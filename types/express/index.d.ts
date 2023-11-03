import { Express } from "express-serve-static-core";

export interface TokenData {
    username: string,
    current_role: number,
    email: string,
    mobile_no: number
}

declare module "express-serve-static-core" {
  interface Request {
    tokenData: object;
  }
}