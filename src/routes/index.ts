import { Request, Response, Router } from "express";

const router = Router();
router.route("/welcome").get(async (req: Request, res: Response) => {
  res.send("Hello world");
});

export default router;
