import type { RequestHandler, Router, Routes } from "../router/router";

export interface Block {
  domain?: string;
  path?: string;
  all?: RequestHandler;
  routes?: Routes;
}

export function defineBlock(data: Block): Block {
  return data;
}
