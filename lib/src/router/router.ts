import type { Request } from "./request/request";

export type RequestHandler = (
  ctx: Context,
  next: () => void
) => any; // true = stop, false = next()

export interface Context {
  request: Request;
  params: any;
  query: any;
}

export interface Router {
  ALL?: RequestHandler | RequestHandler[];
  GET?: RequestHandler | RequestHandler[];
  HEAD?: RequestHandler | RequestHandler[];
  PUT?: RequestHandler | RequestHandler[];
  PATCH?: RequestHandler | RequestHandler[];
  POST?: RequestHandler | RequestHandler[];
  DELETE?: RequestHandler | RequestHandler[];

  [nestedPath: string]: Router | RequestHandler | RequestHandler[] | undefined;
}

export interface Routes {
  [path: string]: Router | RequestHandler | RequestHandler[];
}
