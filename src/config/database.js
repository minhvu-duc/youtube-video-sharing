require("dotenv").config();

module.exports = {
  development: {
    database: "youtube_sharing_development",
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
    define: {
      freezeTableName: true,
    },
  },
  test: {
    database: "youtube_sharing_test",
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
    define: {
      freezeTableName: true,
    },
  },
  test_local: {
    database: "youtube_sharing_test",
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
    define: {
      freezeTableName: true,
    },
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    define: {
      freezeTableName: true,
    },
  },
};
