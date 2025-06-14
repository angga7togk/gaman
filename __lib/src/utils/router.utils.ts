import { MydRequestHandler, MydRoute } from "../router/index";

export function isRouteObject(object: any): object is MydRoute {
  return (
    object &&
    typeof object === "object" &&
    Object.keys(object).some((key) =>
      ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"].includes(key)
    )
  );
}

export function isMydHandler(object: any): object is MydRequestHandler {
  return typeof object === "function";
}

export function translatePath(basePath: string, path: string): string {
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
