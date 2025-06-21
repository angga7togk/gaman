import { CookieManager } from "../cookie";
import { GamanFormData } from "../formdata";
import type { GamanRequest } from "./request";
import { Response } from "./response";

export type RequestHandler = (
  ctx: Context
) => Response | undefined | any | Promise<Response | undefined | any>;

export interface Context {
  request: GamanRequest;
  json: <T>() => Promise<T>;
  formData: () => Promise<GamanFormData>;
  locals: any;
  body: any;
  params: any;
  query: any;
  cookies: CookieManager;
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
