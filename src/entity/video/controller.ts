import { Request, Response } from "express";

import logger from "@logger/index";
import { ERROR_MESSAGE } from "@config/constants";
import { Video } from "@database/video";
import { User } from "@database/user";
import { getYoutubeVideoDetails } from "@services/googleapis";

import wsClients from "@services/websocket";
import validators, { GetVideos, VideoCreate } from "./validator";

type Controller = {
  status: number,
  json: object
}

const controllerWrapper = (controller: any, validator: any) => async (req: Request, res: Response) => {
  try {
    const { error, value: payload } = validator(req);
    if (error) {
      return res.status(400).json({ error: ERROR_MESSAGE.INVALID_REQUEST });
    }
    const result: Controller = await controller(payload);
    return res.status(result.status).json(result.json);
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).json({ error: ERROR_MESSAGE.INTERNAL_ERROR });
  }
};

export const videoCreate = async (payload: VideoCreate): Promise<Controller> => {
  if (!payload.isAuthenticated) {
    return {
      status: 401,
      json: { error: ERROR_MESSAGE.AUTHENTICATION_FAIL },
    };
  }

  const user = await User.findOne({
    where: {
      id: payload.userId,
    },
  });

  if (!user) {
    return {
      status: 401,
      json: { error: ERROR_MESSAGE.AUTHENTICATION_FAIL },
    };
  }

  const video = await Video.findOne({
    where: {
      url: payload.url,
    },
  });
  if (video) {
    return {
      status: 400,
      json: { error: ERROR_MESSAGE.VIDEO_ALREADY_EXISTS },
    };
  }

  const videoIdPattern = /(?:v=|\/)([a-zA-Z0-9_-]{11})/;
  const match = payload.url.match(videoIdPattern);

  let title = "Untitled";
  let description = "Unknown";
  if (match) {
    const result = await getYoutubeVideoDetails(match[1]);
    title = result.title;
    description = result.description;
  }

  const newVideo = await Video.create({
    userId: payload.userId,
    url: payload.url,
    title,
    description,
  });

  wsClients.forEach((client) => {
    const message = `New video [${title}] by [${user.name}]`;
    client.send(message);
  });

  return {
    status: 200,
    json: {
      video: {
        url: newVideo.url,
        title: newVideo.title,
        description: newVideo.description,
        userId: newVideo.userId,
      },
    },
  };
};

export const getVideos = async (payload: GetVideos): Promise<Controller> => {
  const videos = await Video.findAll({
    limit: payload.limit,
    offset: payload.page - 1,
    include: {
      model: User,
      attributes: ["name"],
    },
  });

  return {
    status: 200,
    json: videos,
  };
};

export default {
  videoCreate: controllerWrapper(videoCreate, validators.videoCreate),
  getVideos: controllerWrapper(getVideos, validators.getVideos),
};
