import { formatPath } from "@/utils/utils";
import type { RequestHandler, Routes, FlatRouter } from "./router";

export interface MiddlewareRegister {}

export interface RouteRegister {
  regexPath: RegExp;
  path: string;
  method: string;
  handlers: RequestHandler[];
  paramKeys: string[];
}

export default class AppRouter {
  private routes: Array<RouteRegister> = [];

  getRoutes(): Array<RouteRegister> {
    return this.routes;
  }

  // Apply routes recursively
  applyRoutes(routes: Routes, basePath: string = "/") {
    
    this.forEachFlatRoutes(routes, basePath, (path, flatRouter) => {
      console.log(path);
      if (Array.isArray(flatRouter)) {
        this.registerRoute("ALL", path, flatRouter);
      } else if (typeof flatRouter === "function") {
        this.registerRoute("ALL", path, [flatRouter]);
      } else if (typeof flatRouter === "object") {
        for (const [methodOrNestedPath, handler] of Object.entries(flatRouter)) {
          if (this.isHttpMethod(methodOrNestedPath)) {
            const method = methodOrNestedPath.toUpperCase();
            if (Array.isArray(handler)) {
              this.registerRoute(method, path, handler);
            } else {
              this.registerRoute(method, path, [handler]);
            }
          } else {
            this.applyRoutes(
              { [methodOrNestedPath]: handler } as Routes,
              path
            );
          }
        }
      }
    });
  }

  private registerRoute(
    method: string,
    path: string,
    handlers: RequestHandler[]
  ) {
    const paramKeys: string[] = [];
    const regexString = path
      .replace(/:([^/]+)/g, (_, key) => {
        paramKeys.push(key);
        return "([^/]+)";
      })
      .replace(/\//g, "\\/");

    const regexPath = new RegExp(`^${regexString}$`);
    this.routes.push({
      regexPath,
      path,
      method,
      handlers,
      paramKeys,
    });
  }

  private forEachFlatRoutes(
    routes: Routes,
    basePath: string,
    callback: (
      path: string,
      flatRouter: FlatRouter | RequestHandler | RequestHandler[]
    ) => any
  ): void {
    for (const [path, routeOrHandlers] of Object.entries(routes)) {
      const fullPath = formatPath(`${basePath}/${path}`);

      if (Array.isArray(routeOrHandlers)) {
        callback(fullPath, routeOrHandlers);
      } else if (typeof routeOrHandlers === "function") {
        callback(fullPath, [routeOrHandlers]);
      } else if (typeof routeOrHandlers === "object") {
        if (Object.keys(routeOrHandlers).some(this.isHttpMethod)) {
          // Object contains HTTP methods
          callback(fullPath, routeOrHandlers);
        } else {
          // Nested routes
          this.forEachFlatRoutes(routeOrHandlers as Routes, fullPath, callback);
        }
      }
    }
  }

  private isHttpMethod(method: string): boolean {
    return ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "ALL"].includes(
      method.toUpperCase()
    );
  }
}
