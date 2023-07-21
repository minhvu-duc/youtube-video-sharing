// import request from "supertest";

import db from "@database/index";

import { User } from "@database/user";
import { Video } from "@database/video";
// import { initExpressApp } from "../../src/main";

import users from "./data/user";
import videos from "./data/video";

// const requestApp = request(initExpressApp());

const setupDatabaseBeforeAll = async () => {
  await db.sequelize.sync();
};

const teardownDatabaseAfterAll = async () => {
  await User.destroy({ where: {} });
  await Video.destroy({ where: {} });
  await db.sequelize.close();
};

const seedDatabaseBeforeEach = async () => {
  await User.destroy({ where: {} });
  await User.bulkCreate(users);
  await Video.destroy({ where: {} });
  await Video.bulkCreate(videos);
};

export {
  users,
  videos,
  // requestApp,
  setupDatabaseBeforeAll,
  teardownDatabaseAfterAll,
  seedDatabaseBeforeEach,
};
