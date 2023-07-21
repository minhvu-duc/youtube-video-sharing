import { NextFunction } from "express";
import {
  userCreate,
} from "@entity/user/controller";
import { userAuth } from "@middlewares/auth";

import { Blacklist } from "@database/backlist";
import { User } from "@database/user";
import {
  setupDatabaseBeforeAll, teardownDatabaseAfterAll, seedDatabaseBeforeEach,
} from "../__fixture__/db";

describe("auth middleware", () => {
  beforeAll(setupDatabaseBeforeAll);
  afterAll(teardownDatabaseAfterAll);

  beforeEach(async () => {
    await seedDatabaseBeforeEach();
  });

  it("authenticates user", async () => {
    const newUserPayload = {
      email: "new_user@example.com",
      password: "12345678",
      name: "new_user",
    };

    const result: any = await userCreate(newUserPayload);
    const { token } = result.json;

    const req: any = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res: any = {};
    const next: NextFunction = jest.fn();

    await userAuth(req, res, next);

    expect(req.isAuthenticated()).toBeTruthy();
    expect(req.user.email).toBe(newUserPayload.email);
  });

  it("does not authenticate user when no token", async () => {
    const req: any = { headers: {} };
    const res: any = {};
    const next: NextFunction = jest.fn();

    await userAuth(req, res, next);

    expect(req.isAuthenticated()).toBeFalsy();
  });

  it("does not authenticate user when token has been blacklisted", async () => {
    const newUserPayload = {
      email: "new_user@example.com",
      password: "12345678",
      name: "new_user",
    };

    const result: any = await userCreate(newUserPayload);
    const { token } = result.json;

    await Blacklist.create({ token });

    const req: any = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res: any = {};
    const next: NextFunction = jest.fn();

    await userAuth(req, res, next);

    expect(req.isAuthenticated()).toBeFalsy();
  });

  it("does not authenticate user when user has been removed", async () => {
    const newUserPayload = {
      email: "new_user@example.com",
      password: "12345678",
      name: "new_user",
    };

    const result: any = await userCreate(newUserPayload);
    const { token } = result.json;

    await User.destroy({
      where: {
        email: newUserPayload.email,
      },
    });

    const req: any = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const res: any = {};
    const next: NextFunction = jest.fn();

    await userAuth(req, res, next);

    expect(req.isAuthenticated()).toBeFalsy();
  });
});
