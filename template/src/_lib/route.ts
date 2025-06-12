import express from "express";

export type MydHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => any;

export interface MydRoute {
  GET?: MydHandler[] | MydHandler;
  HEAD?: MydHandler[] | MydHandler;
  PUT?: MydHandler[] | MydHandler;
  PATCH?: MydHandler[] | MydHandler;
  POST?: MydHandler[] | MydHandler;
  DELETE?: MydHandler[] | MydHandler;

  [nestedPath: string]: MydRoute | MydHandler[] | MydHandler | undefined;
}

export interface MydRoutes {
  [path: string]: MydRoute | MydHandler[] | MydHandler;
}

export function isRouteObject(object: any): object is MydRoute {
  return (
    object &&
    typeof object === "object" &&
    Object.keys(object).some((key) =>
      ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"].includes(key)
    )
  );
}

export function isMydHandler(object: any): object is MydHandler {
  return typeof object === "function";
}

export function applyRoutes(
  app: express.Express,
  routes: MydRoutes,
  basePath = ""
) {
  Object.entries(routes).forEach(([path, routeOrHandler]) => {
    const fullPath = `${basePath}${path}`; // Menggabungkan basePath dan path saat ini

    if (isMydHandler(routeOrHandler) || Array.isArray(routeOrHandler)) {
      // Jika langsung handler atau array of handler
      app.use(
        fullPath,
        ...(Array.isArray(routeOrHandler) ? routeOrHandler : [routeOrHandler])
      );
    } else if (isRouteObject(routeOrHandler)) {
      // Jika route dengan method HTTP
      Object.entries(routeOrHandler).forEach(([method, handlers]) => {
        if (
          ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"].includes(method)
        ) {
          const lowerMethod = method.toLowerCase() as keyof express.Application;
          app[lowerMethod](
            fullPath,
            ...(Array.isArray(handlers) ? handlers : [handlers])
          );
        } else {
          // nested routes
          applyRoutes(app, { [method]: handlers } as MydRoutes, fullPath);
        }
      });
    }
  });
}
