import { RequestError } from "../router/error";
import { Response } from "../router/response";
import type { RequestHandler, Router, Routes } from "../router/router";

export interface Block {
  domain?: string;
  path?: string;
  all?: RequestHandler;
  error?: (error: RequestError) => Promise<Response | undefined> | Response | undefined
  routes?: Routes;
}

export function defineBlock(data: Block): Block {
  return data;
}
