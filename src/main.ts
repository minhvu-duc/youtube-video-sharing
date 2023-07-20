import express, { Response, urlencoded } from "express";
import cors from "cors";
import path from "path";
import logger from "./logger";
import env from "./config/env";
import router from "./entity";

import db from "./database";

const main = () => {
  const app = express();

  app.use(express.static(path.join(__dirname, "ui/build")));
  app.use(express.json());
  app.use(urlencoded({ extended: true }));
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use("/", router);

  app.get("/", (_, res: Response) => {
    res.sendFile(path.join(__dirname, "ui/build/index.html"));
  });

  db.sequelize.authenticate().then(() => {
    logger.info("Database connection has been established successfully.");
    app.listen(env.port, () => {
      logger.info(`Server started at port ${env.port}`);
    });
  });
};

main();
