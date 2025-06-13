import { applyRoutes, MydRoutes } from "./route";
import express from "express";

export interface MydBlock {
  path?: string;
  middlewares?: express.RequestHandler[];
  routes?: MydRoutes;
}

export function applyBlocks(app: express.Express, blocks: MydBlock[]) {
  for (const block of blocks) {
    if (block.middlewares) {
      app.use(block.middlewares);
    }
    if (block.routes) {
      applyRoutes(app, block.routes, block.path);
    }
  }
}

export function defineBlock(data: MydBlock): MydBlock {
  return data;
}
