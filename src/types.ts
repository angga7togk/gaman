import type { WebSocket, WebSocketServer } from "ws";
import type { Cookie } from "./utils/cookie";
import type HttpError from "./error/HttpError";
import type { Response } from "./response";
import { ClientRequest } from "http";
import { Headers } from "./utils/headers";

/* -------------------------------------------------------------------------- */
/*                              Interface Global                              */
/* -------------------------------------------------------------------------- */
declare global {
  namespace Gaman {
    interface Locals {}
    interface Env {}
  }
}
export {};

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type AppOptions<A extends AppConfig> = {
  includes?: Array<Handler<A>>;
  blocks?: Array<BlockInterface<A>>;
  error?: (error: Error, ctx: Context<A>) => NextResponse<A>;
  server?: {
    host?: string;
    port?: number;
  };
};

export type LocalsEmpty = object;
export type EnvEmpty = object;

export type AppConfig = {
  Locals: Gaman.Locals;
  Env: Gaman.Env;
};

export type Priority = "very-high" | "high" | "normal" | "low" | "very-low";

/* -------------------------------------------------------------------------- */
/*                                   Handler                                  */
/* -------------------------------------------------------------------------- */

export type Handler<A extends AppConfig> = (c: Context<A>) => NextResponse<A>;
// Tipe handler untuk event-event WebSocket

export interface WebSocketContext extends WebSocket {
  server: WebSocketServer;
}
export type WebSocketServerHandler = (
  ctx: WebSocketContext
) => Promise<WebSocketHandler> | WebSocketHandler;

export type WebSocketHandler = {
  onOpen?: () => void; // Dipanggil saat koneksi terbuka
  onClose?: (code?: number, reason?: string) => void; // Dipanggil saat koneksi ditutup
  onMessage?: (message: any) => void; // Dipanggil saat pesan diterima
  onPong?: (data: Buffer) => void; // Dipanggil saat menerima "pong"
  onError?: (error: Error) => void; // Dipanggil saat terjadi error
  onRedirect?: (url: string, request: ClientRequest) => void;
};

/* -------------------------------------------------------------------------- */
/*                                   Router                                   */
/* -------------------------------------------------------------------------- */

export interface Request {
  method: string;
  url: string;
  pathname: string;
  headers: Headers;
  header: (key: string) => any;
  params: any;
  query: any;
  body: any;
  json: <T = any>() => Promise<T>;
  formData: () => {};
  ip: string;
  raw: any;
}

export interface Context<A extends AppConfig = AppConfig> {
  locals: A["Locals"];
  env: A["Env"];
  pathname: string;
  url: URL;
  params: any;
  query: any;
  cookies: Cookie;
  json: <T = any>() => Promise<T>;
  headers: Headers;
  header: (key: string) => any;
  request: Request;
  response: Response<A>;
}

export type NextResponse<A extends AppConfig> =
  | Promise<Response<A> | undefined>
  | Response<A>
  | undefined
  | any;

export interface Router<A extends AppConfig> {
  ALL?: Handler<A> | Handler<A>[];
  GET?: Handler<A> | Handler<A>[];
  HEAD?: Handler<A> | Handler<A>[];
  PUT?: Handler<A> | Handler<A>[];
  PATCH?: Handler<A> | Handler<A>[];
  POST?: Handler<A> | Handler<A>[];
  DELETE?: Handler<A> | Handler<A>[];

  [nestedPath: string]: Router<A> | Handler<A> | Handler<A>[] | undefined;
}

export interface RoutesDefinition<A extends AppConfig> {
  [path: string]: Router<A> | Handler<A> | Handler<A>[];
}

/* -------------------------------------------------------------------------- */
/*                                    Block                                   */
/* -------------------------------------------------------------------------- */

export interface BlockConfig {
  Services?: object;
}

/**
 * Represents the structure of a block in the application.
 */
export interface BlockInterface<A extends AppConfig> {
  /**
   * must use slash '/' at the end of the path
   * @example '/user/detail/'
   */
  strict?: boolean;

  /**
   * Array of included middlewares
   */
  includes?: Array<Handler<A>>;

  /**
   * Determines the priority of the block.
   * Higher priorities are processed earlier.
   */
  priority?: Priority;

  /**
   * Specifies the domain under which this block operates.
   * If omitted, the block applies to all domains.
   */
  domain?: string;

  /**
   * Defines the base path for this block.
   * All routes and WebSocket handlers within the block are scoped to this path.
   */
  path?: string;

  /**
   * Handler for all incoming HTTP requests to the block.
   * This is a catch-all handler that processes all paths not explicitly defined in `routes`.
   */
  all?: Handler<A>;

  /**
   * Handler for HTTP requests that do not match any defined route in the block.
   */
  notFound?: Handler<A>;

  /**
   * Error handler for the block.
   * This function is called when an error occurs while processing a request.
   *
   * @param error - The error object containing details about the error.
   * @param ctx - The context object representing the current request.
   * @returns A `NextResponse` to handle the error gracefully.
   */
  error?: (error: HttpError, ctx: Context<A>) => NextResponse<A>;

  /**
   * Defines a set of routes for this block.
   * Each route maps a path to a specific handler.
   */
  routes?: RoutesDefinition<A>;

  /**
   * WebSocket server handler for the block.
   * This handles WebSocket connections scoped to the block's path.
   */
  websocket?: WebSocketServerHandler;
}
