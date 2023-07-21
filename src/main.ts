import express, { Response, urlencoded } from "express";
import cors from "cors";
import path from "path";
import WebSocket from "ws";
import http from "http";
import wsClients from "@services/websocket";
import { ERROR_MESSAGE } from "@config/constants";
import { Blacklist } from "@database/backlist";
import { verifyJWT } from "@utils/jwt";
import { User } from "@database/user";
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

  const server = http.createServer(app);

  const websocketServer = new WebSocket.Server({ server });

  websocketServer.on("connection", async (ws: WebSocket, req: http.IncomingMessage) => {
    try {
      const { searchParams } = new URL(req.url || "", "http://localhost");
      const accessToken = searchParams.get("accessToken");
      if (!accessToken) throw new Error("Access token missing");

      const { error, userId } = verifyJWT(accessToken, env.jwtSecret);
      if (error) throw new Error("Access tokne invalid");

      const isInBlackList = await Blacklist.findOne({
        where: { token: accessToken },
      });
      if (isInBlackList) throw new Error("Access tokne invalid");

      const user = await User.findOne({ where: { id: userId } });
      if (!user) throw new Error("User does not exist");

      wsClients.add(ws);

      ws.on("close", () => {
        logger.info("Client disconnected: ", ws.url);
        wsClients.delete(ws);
      });
    } catch (err: any) {
      logger.error(err.message);
      ws.close(1000, ERROR_MESSAGE.AUTHENTICATION_FAIL);
    }
  });

  db.sequelize.authenticate().then(() => {
    logger.info("Database connection has been established successfully.");
    server.listen(env.port, () => {
      logger.info(`Server started at port ${env.port}`);
    });
  });
};

main();
