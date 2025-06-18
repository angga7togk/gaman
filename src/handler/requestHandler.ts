import { Block } from "../block/block";
import { AppRouter } from "../router/AppRouter";
import { RequestError } from "../router/error";
import { Response } from "../router/response";
import { Context } from "../router/router";
import { Logger } from "../utils/Logger";

export async function requestHandler(
  appRouter: AppRouter,
  blocks: Block[],  
  ctx: Context
): Promise<Response | undefined> {
  let indexRoute = 0;
  Logger.setRoute(ctx.request.pathname);

  async function nextRoute(): Promise<Response | undefined> {
    const route = appRouter.getRoutes()[indexRoute++];
    if (!route) return undefined; // Jika tidak ada route, hentikan

    const match = route.regexPath.exec(ctx.request.pathname);

    if (
      match &&
      (route.method === ctx.request.method || route.method === "ALL")
    ) {
      for (const handler of route.handlers) {
        try {
          // Jalankan handler dan tunggu jika handler mengembalikan Promise
          const res = await handler(ctx);

          if (res !== undefined) {
            // Jika handler mengembalikan respons, hentikan
            if (!(res instanceof Response)) {
              if (typeof res === "string") {
                return new Response(res, {
                  status: 200,
                  cookies: ctx.cookies,
                });
              } else {
                return Response.json(res, {
                  status: 200,
                  cookies: ctx.cookies,
                });
              }
            } else {
              
              return new Response(res.getBody(), {
                ...res.getOptions(),
                cookies: ctx.cookies,
              });
            }
          }
        } catch (error: any) {
          Logger.error(error);
          for (const block of blocks) {
            return await block.error?.(
              new RequestError(error.message, ctx.request)
            );
          }
        }
      }
    }

    // Lanjutkan ke route berikutnya jika tidak cocok atau tidak ada respons
    return nextRoute();
  }

  try {
    // Mulai iterasi route
    return await nextRoute();
  } finally {
    // Setel route kembali ke nilai default
    Logger.setRoute("");
  }
}