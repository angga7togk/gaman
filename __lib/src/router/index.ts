export * from "../utils/router.utils";
export * from "./context/next";
export * from "./context/response";
export * from "./context/request";

import express from "express";
import { isMydHandler, isRouteObject, translatePath } from "../utils/router.utils";
import { MydRequest } from "./context/request";
import { MydResponse } from "./context/response";
import { MydNextFunction } from "./context/next";

export interface MydContext {}

export type MydRequestHandler = (
  req: MydRequest,
  res: MydResponse,
  next: MydNextFunction
) => any;

export interface MydRoute {
  GET?: MydRequestHandler | MydRequestHandler[];
  HEAD?: MydRequestHandler | MydRequestHandler[];
  PUT?: MydRequestHandler | MydRequestHandler[];
  PATCH?: MydRequestHandler | MydRequestHandler[];
  POST?: MydRequestHandler | MydRequestHandler[];
  DELETE?: MydRequestHandler | MydRequestHandler[];

  [nestedPath: string]:
    | MydRoute
    | MydRequestHandler
    | MydRequestHandler[]
    | undefined;
}

export interface MydRoutes {
  [path: string]: MydRoute | MydRequestHandler | MydRequestHandler[];
}

export function applyRoutes(
  appRouter: express.Router,
  routes: MydRoutes,
  basePath = ""
) {
  // Dapatkan route yang lebih spesifik terlebih dahulu
  const sortedRoutes = Object.entries(routes).sort(([pathA], [pathB]) => {
    // Route yang lebih panjang didaftarkan lebih dulu
    return pathB.length - pathA.length;
  });

  sortedRoutes.forEach(([path, routeOrHandler]) => {
    const fullPath = translatePath(basePath, path); // Menggabungkan basePath dan path saat ini
    if (isMydHandler(routeOrHandler) || Array.isArray(routeOrHandler)) {
      // Jika langsung handler atau array of handler
      appRouter.all(
        // ganti pakai all kalau paka use bahaya
        fullPath,
        ...apply(
          Array.isArray(routeOrHandler) ? routeOrHandler : [routeOrHandler]
        )
      );
    } else if (isRouteObject(routeOrHandler)) {
      // Jika route dengan method HTTP
      Object.entries(routeOrHandler).forEach(([method, handlers]) => {
        if (
          ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"].includes(method)
        ) {
          const lowerMethod = method.toLowerCase();
          (appRouter as any)[lowerMethod](
            fullPath,
            ...apply(Array.isArray(handlers) ? handlers : ([handlers] as any))
          );
        } else {
          // Nested routes
          applyRoutes(appRouter, { [method]: handlers } as MydRoutes, fullPath);
        }
      });
    }
  });
}

function apply(handlers: MydRequestHandler[]): express.RequestHandler[] {
  return handlers as express.RequestHandler[];
}
