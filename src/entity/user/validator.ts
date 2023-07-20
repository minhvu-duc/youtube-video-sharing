import { Request } from "express";
import Joi from "joi";

export type UserCreate = {
  email: string,
  password: string,
  name: string
}

export type UserLogin = {
  email: string,
  password: string
}

export type UserLogout = {
  isAuthenticated: boolean,
  token: string
}

export type UserInfo = {
  isAuthenticated: boolean,
  user: {
    email: string,
    name: string
  }
}

const userCreate = (req: Request): Joi.ValidationResult<UserCreate> => {
  const schema = Joi.object<UserCreate>({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  });

  return schema.validate(req.body);
};

const userLogin = (req: Request): Joi.ValidationResult<UserLogin> => {
  const schema = Joi.object<UserLogin>({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
  });
  return schema.validate(req.body);
};

const userLogout = (req: Request): Joi.ValidationResult<UserLogout> => {
  const isAuthenticated = req.isAuthenticated();
  const token = req.headers.authorization?.slice(7);

  const schema = Joi.object<UserLogout>({
    isAuthenticated: Joi.boolean().required(),
    token: Joi.string().required(),
  });

  return schema.validate({ isAuthenticated, token });
};

const userInfo = (req: Request): Joi.ValidationResult<UserInfo> => {
  const isAuthenticated = req.isAuthenticated();
  const userData = req.user?.toJSON() || {};

  const schema = Joi.object<UserInfo>({
    isAuthenticated: Joi.boolean().required(),
    user: {
      email: Joi.string(),
      name: Joi.string(),
    },
  });
  return schema.validate({
    isAuthenticated,
    user: {
      email: userData.email,
      name: userData.name,
    },
  });
};

export default {
  userCreate,
  userLogin,
  userLogout,
  userInfo,
};
