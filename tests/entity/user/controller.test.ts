import { User } from "@database/user";
import { Blacklist } from "@database/backlist";
import {
  userCreate, userLogin, userLogout, userInfo,
} from "@entity/user/controller";

import {
  users, setupDatabaseBeforeAll, teardownDatabaseAfterAll, seedDatabaseBeforeEach,
} from "../../__fixture__/db";

describe("User Controller", () => {
  beforeAll(setupDatabaseBeforeAll);
  afterAll(teardownDatabaseAfterAll);

  beforeEach(async () => {
    await seedDatabaseBeforeEach();
  });

  describe("createUser", () => {
    it("creates new user successfully", async () => {
      const newUserPayload = {
        email: "new_user@example.com",
        password: "12345678",
        name: "new_user",
      };

      const result: any = await userCreate(newUserPayload);

      expect(result.status).toBe(201);
      expect(result.json.token).toBeTruthy();
      expect(result.json.user.email).toBe(newUserPayload.email);

      const totalUsers = await User.count();
      expect(totalUsers).toBe(users.length + 1);
    });

    it("does not create new user if has existed user", async () => {
      const newUserPayload = users[0];
      const result: any = await userCreate(newUserPayload);

      expect(result.status).toBe(400);

      const totalUsers = await User.count();
      expect(totalUsers).toBe(users.length);
    });
  });

  describe("userLogin", () => {
    it("logs user in and returns access token", async () => {
      const newUserPayload = {
        email: "new_user@example.com",
        password: "12345678",
        name: "new_user",
      };

      await User.create(newUserPayload);

      const userCredentials = {
        email: newUserPayload.email,
        password: newUserPayload.password,
      };

      const result: any = await userLogin(userCredentials);

      expect(result.status).toBe(200);
      expect(result.json.token).toBeTruthy();
    });

    it("does not log user in if has wrong email or password", async () => {
      const newUserPayload = {
        email: "new_user@example.com",
        password: "12345678",
        name: "new_user",
      };

      await User.create(newUserPayload);

      const userCredentials = {
        email: newUserPayload.email,
        password: `${newUserPayload.password}wrong`,
      };

      const result: any = await userLogin(userCredentials);

      expect(result.status).toBe(401);
    });
  });

  describe("userLogout", () => {
    it("logs user out and puts token to blacklist", async () => {
      const payload = {
        isAuthenticated: true,
        token: "example_token",
      };

      const result: any = await userLogout(payload);
      expect(result.status).toBe(200);

      const blacklist = await Blacklist.findOne({
        where: {
          token: payload.token,
        },
      });

      expect(blacklist).not.toBeNull();
    });
  });

  describe("userInfo", () => {
    it("returns user info", async () => {
      const payload = {
        isAuthenticated: true,
        user: {
          email: "example@gmail.com",
          name: "example",
        },
      };
      const result: any = await userInfo(payload);

      expect(result.status).toBe(200);
      expect(result.json.user).toEqual(payload.user);
    });
  });
});
