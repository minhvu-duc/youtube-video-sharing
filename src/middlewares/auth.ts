import { NextFunction, Request, Response } from "express";
import { User } from "../database/user";
import { Blacklist } from "../database/backlist";
import { ERROR_MESSAGE } from "../config/constants";
import { verifyJWT } from "../utils/jwt";

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.headers.authorization) {
      req.isAuthenticated = () => false;
      return next();
    }

    const { error, userId } = verifyJWT(
      req.headers.authorization.slice(7),
      process.env.JWT_SECRET as string,
    );

    if (error) {
      req.isAuthenticated = () => false;
      return next();
    }

    const isInBlackList = await Blacklist.findOne({
      where: { token: req.headers.authorization.slice(7) },
    });
    if (isInBlackList) {
      req.isAuthenticated = () => false;
      return next();
    }

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      req.isAuthenticated = () => false;
      return next();
    }

    req.user = user;
    req.isAuthenticated = () => true;
    return next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: ERROR_MESSAGE.AUTHENTICATION_FAIL });
  }
};
