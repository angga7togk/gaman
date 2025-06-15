import type { RequestHandler, Router, Routes } from "../router/router";

export interface Block {
  domain?: string;
  path?: string;
  all?: Router | RequestHandler | RequestHandler[];
  routes?: Routes;
}

export function defineBlock(data: Block): Block {
  return data;
}
