import { Router } from "express";

export class MydController {
  public basePath: string = "/";
  public router: Router = Router();

  constructor(basePath?: string) {
    this.basePath = basePath || "/";
  }
}

export type MydControllerConstructor = new (...args: any[]) => MydController;

