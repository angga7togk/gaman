import express from "express";
import { MydRoutes } from "./route";

export interface MydBlock {
  path?: string;
  middlewares?: express.RequestHandler[];
  routes?: MydRoutes;
}

export function defineBlock(data: MydBlock): MydBlock {
  return data;
}
