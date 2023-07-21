import db from "@database/index";

import { User } from "@database/user";
import { Video } from "@database/video";

import users from "./data/user";
import videos from "./data/video";

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
  setupDatabaseBeforeAll,
  teardownDatabaseAfterAll,
  seedDatabaseBeforeEach,
};
