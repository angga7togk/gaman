import { Request, Response } from "express";
import { MydControllerConstructor } from "./class";

type HttpMethod = "get" | "post" | "put" | "delete";

interface RouteDefinition {
  path: string;
  method: HttpMethod;
  handlerName: string;
}

const routes: Map<Function, RouteDefinition[]> = new Map();

/**
 * Helper to create HTTP method decorators (`@Get`, `@Post`, etc.).
 */
function createRouteDecorator(method: HttpMethod) {
  return function (path: string): MethodDecorator {
    return function (target, propertyKey) {
      const controllerClass = target.constructor;

      if (!routes.has(controllerClass)) {
        routes.set(controllerClass, []);
      }

      routes.get(controllerClass)!.push({
        path,
        method,
        handlerName: propertyKey as string,
      });
    };
  };
}

export const Get = createRouteDecorator("get");
export const Post = createRouteDecorator("post");
export const Put = createRouteDecorator("put");
export const Delete = createRouteDecorator("delete");

/**
 * Apply all routes to the Express app.
 */
export function applyRoutes(app: any, controllers: MydControllerConstructor[]) {
  for (const Controller of controllers) {
    const controllerInstance = new Controller();
    const controllerRoutes = routes.get(Controller);

    if (!controllerRoutes) continue;

    for (const route of controllerRoutes) {
      const fullPath = `${controllerInstance.basePath}${route.path}`;

      app[route.method](fullPath, (req: Request, res: Response) => {
        (controllerInstance as any)[route.handlerName](req, res);
      });
    }
  }
}
