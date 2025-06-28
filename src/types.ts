import type { WebSocket, WebSocketServer } from "ws";
import type { Cookie } from "./utils/cookie";
import type HttpError from "./error/HttpError";
import type { RenderResponse, Response } from "./response";
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

export type IntegrationInterface<A extends AppConfig = AppConfig> = {
  /**
   * The name of the integration.
   * This property is required.
   */
  name: string;

  /**
   * The priority of the integration.
   * This property is required and determines the execution order of integrations.
   */
  priority: Priority;

  /**
   * Callback executed when the integration is loaded.
   * Use this to perform setup or initialization tasks.
   */
  onLoad?: (app: AppOptions<A>) => void;

  /**
   * Callback executed when the integration is disabled.
   * Use this to clean up or remove configurations.
   */
  onDisabled?: (app: AppOptions<A>) => void;

  /**
   * Callback executed when a client makes a request to the server.
   * This allows you to modify the context or handle specific request logic.
   */
  onRequest?: (app: AppOptions<A>, ctx: Context<A>) => NextResponse<A>;

  /**
   * Callback executed before the response is sent to the client.
   * Use this to modify or enhance the response.
   */
  onResponse?: (
    app: AppOptions<A>,
    ctx: Context<A>,
    res: NextResponse<A>
  ) => NextResponse<A>;

  /**
   * Callback executed when rendering a view using a view engine.
   * This is specifically for handling view engine rendering, such as EJS or other template engines.
   * Use this to modify the context or response before rendering the view.
   */
  onRender?: (
    app: AppOptions<A>,
    ctx: Context<A>,
    res: RenderResponse<A>
  ) => NextResponse<A>;
};

export type AppOptions<A extends AppConfig> = {
  /**
   * List of integrations to be used in the application.
   * Integrations can modify app behavior or add features.
   */
  integrations?: Array<IntegrationInterface<A>>;

  /**
   * List of blocks defining routes, middlewares, and other functionalities for the application.
   */
  blocks?: Array<BlockInterface<A>>;

  /**
   * Global error handler for handling application-wide errors.
   * Called with the error and the current request context.
   */
  error?: (error: Error, ctx: Context<A>) => NextResponse<A>;

  /**
   * Server configuration options, including host and port.
   */
  server?: {
    /**
     * The host address for the server.
     * Defaults to 'localhost' if not specified.
     */
    host?: string;

    /**
     * The port number for the server.
     * Defaults to 3431 if not specified.
     */
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
}

export type NextResponse<A extends AppConfig> =
  | Promise<Response<A> | RenderResponse<A> | undefined>
  | Response<A>
  | object
  | Array<any>
  | string
  | RenderResponse<A>
  | undefined;

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
