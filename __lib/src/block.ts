import { applyRoutes, MydRoutes } from "./router/index";
import express, { Router, RouterOptions } from "express";

export interface MydBlock {
  path?: string;
  middlewares?: express.RequestHandler[];
  routes?: MydRoutes;
  routerOptions?: RouterOptions;
}

export function applyBlocks(app: express.Express, blocks: MydBlock[]) {
  for (const block of blocks) {
    const router = Router(block.routerOptions);
    if (block.middlewares) {
      router.use(block.middlewares);
    }
    if (block.routes) {
      applyRoutes(router, block.routes, block.path);
    }
    app.use(router)
  }
}

export function defineBlock(data: MydBlock): MydBlock {
  return data;
}
