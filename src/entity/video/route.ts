import { Router } from "express";
import { userAuth } from "@middlewares/auth";
import videoControllers from "./controller";

const videoRouter = Router();
videoRouter.route("/create").post(userAuth, videoControllers.videoCreate);
videoRouter.route("/get").get(videoControllers.getVideos);

export default videoRouter;
