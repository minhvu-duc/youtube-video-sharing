import fs from "fs";
import path from "path";
import { DataTypes, Sequelize } from "sequelize";

const dbconfig = require("../config/database");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = (dbconfig as any)[env];
const db: { [key: string]: any } = {};

let sequelize: Sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    define: {
      freezeTableName: true,
    },
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) => file.indexOf(".") !== 0
      && file !== basename
      && [".js", ".ts"].includes(file.slice(-3)),
  )
  .forEach((file) => {
    /* eslint-disable global-require */
    /* eslint-disable import/no-dynamic-require */
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
