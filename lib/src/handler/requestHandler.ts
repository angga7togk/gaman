import AppRouter from "../router/AppRouter";
import { Context } from "../router/router";
import { Logger } from "../utils/Logger";

export function requestHandler(appRouter: AppRouter, ctx: Context) {
  let indexRoute = 0;
  Logger.info(ctx.request.pathname);
  function nextRoute() {
    // Ambil route saat ini
    const route = appRouter.getRoutes()[indexRoute++];
    if (!route) return; // Jika tidak ada route, hentikan
    const match = route.regexPath.exec(ctx.request.pathname);

    if (
      match &&
      (route.method === ctx.request.method || route.method === "ALL")
    ) {
      let indexHandle = 0;

      function next() {
        const handler = route.handlers[indexHandle++];
        if (handler) {
          // Panggil handler dengan ctx dan next

          handler(ctx, next);
        } else {
          // Semua handler di route selesai, lanjut ke route berikutnya
          nextRoute();
        }
      }
      next();
    }
    nextRoute();
  }

  // Mulai iterasi route
  nextRoute();
}
