import { Request, Response, NextFunction } from "express";
import { ACCESS_TOKEN_SECRET } from "../objects/UserAccount/UserAccount.constants";
import { verify } from "jsonwebtoken";
import {
  MISSING_REQUIRED_FIELDS_ERROR,
  UNAUTHORIZED_ERROR,
} from "../constants/Responses";
import fileType from "file-type";

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const accessToken = authHeader.split(" ")[1];
      if (accessToken && ACCESS_TOKEN_SECRET) {
        const user = await verify(accessToken, ACCESS_TOKEN_SECRET);
        req.body.user = user;
        next();
      } else {
        return res.status(403).json(UNAUTHORIZED_ERROR);
      }
    }
    return res;
  } catch (error: any) {
    if ((error as Error).name === "TokenExpiredError") {
      return res.status(401).json(UNAUTHORIZED_ERROR);
    }
  }
};

export const validateRequest = (mandatoryFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (let field of mandatoryFields) {
      if (!req.body.hasOwnProperty(field) || req.body[field] === undefined) {
        return res.status(400).json(MISSING_REQUIRED_FIELDS_ERROR);
      }
    }
    next();
  };
};
