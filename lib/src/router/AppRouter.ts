import { formatPath } from "../utils/utils";
import type { RequestHandler, Router, Routes } from "./router";

// Interface untuk merepresentasikan route yang telah terdaftar
export interface RouteRegister {
  regexPath: RegExp; // Regex untuk mencocokkan path
  path: string; // Path asli route
  method: string; // HTTP method (GET, POST, dll.)
  handlers: RequestHandler[]; // Array handler untuk route ini
  paramKeys: string[]; // Array nama parameter dalam path (misal :id)
}

export default class AppRouter {
  /**
   * Menyimpan semua rute yang terdaftar, termasuk middleware
   */
  private routes: Array<RouteRegister> = [];

  /**
   * Menyimpan semua middleware sementara sebelum digabungkan ke rute
   */
  private middlewares: Array<RouteRegister> = [];

  /**
   * Mengambil semua rute yang terdaftar
   */
  getRoutes(): Array<RouteRegister> {
    return this.routes;
  }

  /**
   * Menambahkan dan mengatur rute dari definisi yang diberikan secara rekursif
   * @param routes - Definisi rute
   * @param basePath - Base path untuk rute ini (default: "/")
   */
  applyRoutes(routes: Routes, basePath: string = "/") {
    // Iterasi melalui rute dan mendaftarkannya
    this.forEachFlatRoutes(routes, basePath, (path, router, handlers) => {
      if (handlers && Array.isArray(handlers)) {
        // Jika rute memiliki banyak handler
        this.registerRoute("ALL", path, handlers);
      } else if (router && typeof router === "object") {
        // Jika rute memiliki router dengan HTTP method spesifik
        for (const [methodOrNestedPath, handler] of Object.entries(router)) {
          if (this.isHttpMethod(methodOrNestedPath)) {
            const method = methodOrNestedPath.toUpperCase();
            const singleOrMultiHandler = handler as
              | RequestHandler
              | RequestHandler[];

            this.registerRoute(
              method,
              path,
              Array.isArray(singleOrMultiHandler)
                ? singleOrMultiHandler
                : [singleOrMultiHandler]
            );
          }
        }
      }
    });

    // Setelah semua rute terdaftar, gabungkan middleware ke rute
    this.applyMiddlewares();
  }

  /**
   * Mendaftarkan rute ke dalam sistem
   * @param method - HTTP method untuk rute ini
   * @param path - Path untuk rute ini
   * @param handlers - Array handler untuk rute ini
   */
  private registerRoute(
    method: string,
    path: string,
    handlers: RequestHandler[]
  ) {
    const paramKeys: string[] = [];
    const regexString = path
      .replace(/:([^/]+)/g, (_, key) => {
        paramKeys.push(key); // Simpan parameter dinamis
        return "([^/]+)"; // Konversi ke regex
      })
      .replace(/\//g, "\\/");

    const regexPath = new RegExp(`^${regexString}$`);
    const data: RouteRegister = {
      regexPath,
      path,
      method,
      handlers,
      paramKeys,
    };

    if (path.includes("*")) {
      // Jika path mengandung wildcard, daftarkan sebagai middleware
      
      this.middlewares.push(data);
    } else {
      // Jika tidak, daftarkan sebagai rute biasa
      this.routes.push(data);
    }
  }

  /**
   * Rekursif untuk menelusuri dan mengolah semua rute
   * @param routes - Definisi rute
   * @param basePath - Base path saat ini
   * @param callback - Callback untuk setiap rute yang ditemukan
   */
  private forEachFlatRoutes(
    routes: Routes,
    basePath: string,
    callback: (
      path: string,
      router?: Router,
      handlers?: RequestHandler[]
    ) => any
  ): void {
    const isMethod = this.isHttpMethod;
    function each(_routes: Routes, _basePath: string) {
      for (const [path, routeOrHandlers] of Object.entries(_routes)) {
        const fullPath = formatPath(`${_basePath}/${path}`);

        if (Array.isArray(routeOrHandlers)) {
          // Jika rute adalah array handler
          callback(fullPath, undefined, routeOrHandlers);
        } else if (typeof routeOrHandlers === "function") {
          // Jika rute adalah fungsi handler tunggal
          callback(fullPath, undefined, [routeOrHandlers]);
        } else if (typeof routeOrHandlers === "object") {
          if (Object.keys(routeOrHandlers).some(isMethod)) {
            // Jika rute memiliki HTTP method
            callback(fullPath, routeOrHandlers);
          }
          for (const [methodOrNestedPath, handler] of Object.entries(
            routeOrHandlers
          )) {
            if (!isMethod(methodOrNestedPath)) {
              // Jika bukan HTTP method, iterasi lebih dalam
              each({ [methodOrNestedPath]: handler } as Routes, fullPath);
            }
          }
        }
      }
    }

    each(routes, basePath);
  }

  /**
   * Menerapkan middleware ke rute yang sesuai
   */
  private applyMiddlewares() {
    this.routes.forEach((route) => {
      this.middlewares.forEach((middleware) => {
        const wildCardType = this.wildCardOn(middleware.path);
        

        if (middleware.method === route.method || middleware.method === "ALL") {
          if (
            wildCardType === "start" &&
            route.path.endsWith(middleware.path.replace("*/", ""))
          ) {
            // Middleware berbentuk `*/path`
            route.handlers.unshift(...middleware.handlers);
          } else if (
            wildCardType === "end" &&
            route.path.startsWith(middleware.path.replace("/*", ""))
          ) {
            // Middleware berbentuk `/path/*`
            route.handlers.unshift(...middleware.handlers);
          } else if (wildCardType === "all") {
            // Middleware berbentuk `*`
            route.handlers.unshift(...middleware.handlers);
          }
        }
      });
    });

    // setelah proses selesai clear semua data middleware
    // karna sudah di migrasi ke data routes jadi gaperlu ada
    // karna ntar kalau applyRoutes lagi bakal jadi 2x
    this.middlewares = [];
  }

  /**
   * Menentukan jenis wildcard berdasarkan pola
   * @param path - Path dengan pola wildcard
   * @returns Jenis wildcard ("start", "end", atau "all")
   */
  private wildCardOn(path: string): "start" | "end" | "all" | undefined {
    if (path.includes("*")) {
      if (path.startsWith("*/")) {
        return "start";
      } else if (path.endsWith("/*")) {
        return "end";
      } else if (path === "/*" || path === "*" || path === "*/") {
        return "all";
      }
    }
  }

  /**
   * Konversi path dengan wildcard menjadi regex
   * @param routePattern - Path dengan pola wildcard
   * @returns Regex untuk pola wildcard
   */
  private wildCardConvertToRegex(routePattern: string): RegExp {
    let regexPattern = routePattern.replace(/\//g, "\\/");
    regexPattern = regexPattern.replace(/\*/g, ".*");
    return new RegExp(`^${regexPattern}`);
  }

  /**
   * Mengecek apakah string adalah HTTP method
   * @param method - String untuk dicek
   * @returns True jika string adalah HTTP method valid
   */
  private isHttpMethod(method: string): boolean {
    return ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "ALL"].includes(
      method.toUpperCase()
    );
  }
}
