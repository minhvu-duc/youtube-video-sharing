import express, { Response, urlencoded } from "express";
import cors from "cors";
import logger from "./logger";
import env from "./config/env";
import routes from "./routes";

import db from "./database";

const main = () => {
  const app = express();

  app.use(express.json());
  app.use(urlencoded({ extended: true }));
  app.use(cors({
    origin: process.env.REQUEST_ORIGIN,
    credentials: true,
  }));
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use("/", routes);

  app.get("/", (_, res: Response) => {
    res.send("Youtube sharing app");
  });

  db.sequelize.authenticate().then(() => {
    logger.info("Database connection has been established successfully.");
    app.listen(env.port, () => {
      logger.info(`Server started at port ${env.port}`);
    });
  });
};

main();
