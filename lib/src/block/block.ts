import type { Routes } from "../router/router";

export interface Block {
  path?: string;
  routes?: Routes;
}

export function defineBlock(data: Block): Block {
  return data;
}
