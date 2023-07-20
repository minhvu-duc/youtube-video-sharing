import { Request } from "express";
import Joi from "joi";

export type VideoCreate = {
  isAuthenticated: boolean
  url: string,
  title: string,
  description: string,
  userId: string
}

export type GetVideos = {
  page: number,
  limit: number
}

const videoCreate = (req: Request): Joi.ValidationResult<VideoCreate> => {
  const isAuthenticated = req.isAuthenticated();
  const userData = req.user?.toJSON() || {};

  const schema = Joi.object<VideoCreate>({
    isAuthenticated: Joi.boolean().required(),
    url: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    userId: Joi.string(),
  });

  return schema.validate({
    ...req.body,
    isAuthenticated,
    userId: userData.id,
  });
};

const getVideos = (req:Request): Joi.ValidationResult<GetVideos> => {
  const schema = Joi.object<GetVideos>({
    page: Joi.number().greater(0).required(),
    limit: Joi.number().greater(0).required(),
  });

  return schema.validate(req.body);
};

export default {
  videoCreate,
  getVideos,
};
