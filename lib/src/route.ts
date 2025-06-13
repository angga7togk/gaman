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

function translatePath(basePath: string, path: string): string {
  // Pastikan basePath diawali dengan "/" dan tidak diakhiri dengan "/"
  if (basePath !== "/") {
    if (!basePath.startsWith("/")) {
      basePath = `/${basePath}`;
    }
    if (basePath.endsWith("/")) {
      basePath = basePath.slice(0, -1);
    }
  } else {
    basePath = "";
  }

  // Pastikan path diawali dengan "/"
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  // Gabungkan basePath dan path
  return `${basePath}${path}`;
}

export function applyRoutes(
  app: express.Express,
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
      app.all( // ganti pakai all kalau paka use bahaya
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
          // Nested routes
          applyRoutes(app, { [method]: handlers } as MydRoutes, fullPath);
        }
      });
    }
  });
}
