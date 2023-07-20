import { Router } from "express";
import { userAuth } from "@middlewares/auth";
import userControllers from "./controller";

const userRouter = Router();
userRouter.route("/login").post(userControllers.userLogin);
userRouter.route("/logout").post(userAuth, userControllers.userLogout);
userRouter.route("/create").post(userControllers.userCreate);
userRouter.route("/info").get(userAuth, userControllers.userInfo);

export default userRouter;
