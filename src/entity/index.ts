import { Router } from "express";
import userRouter from "./user/route";
import videoRouter from "./video/route";

const router = Router();
router.use("/user", userRouter);
router.use("/video", videoRouter);

export default router;
