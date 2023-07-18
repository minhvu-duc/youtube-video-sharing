import express, { Response, urlencoded } from "express";
import cors from "cors";
import logger from "./logger";
import env from "./config/env";
import routes from "./routes";

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

  app.listen(env.port);
};

main();
