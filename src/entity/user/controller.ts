import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { ERROR_MESSAGE } from "@config/constants";
import validators, {
  UserCreate, UserInfo, UserLogin, UserLogout,
} from "@entity/user/validator";
import { User } from "@database/user";
import logger from "@logger/index";
import { isEmpty } from "lodash";
import { generateJWTAccessToken } from "@utils/jwt";
import { Blacklist } from "@database/backlist";

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

export const userCreate = async (payload: UserCreate): Promise<Controller> => {
  const userWithThisEmail = await User.findOne({
    where: { email: payload.email },
  });
  if (!isEmpty(userWithThisEmail)) {
    return {
      status: 400,
      json: { error: ERROR_MESSAGE.USER_ALREADY_EXISTS },
    };
  }

  let newUser = await User.create({
    email: payload.email,
    password: payload.password,
    name: payload.name,
  });
  newUser = newUser.toJSON();
  delete (newUser as any).password;
  const accessToken = generateJWTAccessToken(newUser.id);
  return {
    status: 201,
    json: {
      token: accessToken,
      user: newUser,
    },
  };
};

export const userLogin = async (payload: UserLogin): Promise<Controller> => {
  const userWithThisEmail = await User.findOne({
    where: { email: payload.email },
  });
  if (isEmpty(userWithThisEmail)) {
    return {
      status: 401,
      json: { error: ERROR_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD },
    };
  }
  const passwordCorrect = await bcrypt.compare(
    payload.password,
    userWithThisEmail.password,
  );

  if (!passwordCorrect) {
    return {
      status: 401,
      json: { error: ERROR_MESSAGE.INCORRECT_EMAIL_OR_PASSWORD },
    };
  }

  const accessToken = generateJWTAccessToken(userWithThisEmail.id);
  return {
    status: 200,
    json: {
      token: accessToken,
      user: {
        id: userWithThisEmail.id,
        email: userWithThisEmail.email,
        name: userWithThisEmail.name,
      },
    },
  };
};

export const userLogout = async (payload: UserLogout): Promise<Controller> => {
  if (!payload.isAuthenticated) {
    return {
      status: 401,
      json: { error: ERROR_MESSAGE.AUTHENTICATION_FAIL },
    };
  }

  await Blacklist.create({ token: payload.token });
  return {
    status: 200,
    json: {},
  };
};

export const userInfo = async (payload: UserInfo): Promise<Controller> => {
  if (!payload.isAuthenticated) {
    return {
      status: 401,
      json: { error: ERROR_MESSAGE.AUTHENTICATION_FAIL },
    };
  }

  return {
    status: 200,
    json: { user: payload.user },
  };
};

export default {
  userCreate: controllerWrapper(userCreate, validators.userCreate),
  userLogin: controllerWrapper(userLogin, validators.userLogin),
  userLogout: controllerWrapper(userLogout, validators.userLogout),
  userInfo: controllerWrapper(userInfo, validators.userInfo),
};
