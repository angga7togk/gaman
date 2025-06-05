import { Request, Response } from "express";
import { Get, MydController } from "_lib/decorators/routes/router.decorator";

export default class HomeController extends MydController {
  constructor() {
    super();
  }

  @Get("/")
  get(req: Request, res: Response) {
    return res.json({ message: "❤️ Welcome to MyD.JS" });
  }
}
