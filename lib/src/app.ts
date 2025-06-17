import type { Block } from "./block/block";
import { AppRouter } from "./router/AppRouter";
import { createServer } from "./server/server";

export interface AppOptions {
  server?: {
    host?: string;
    port?: number;
  };
  blocks?: Block[];
}

const defaultOptions: AppOptions = {
  server: { host: "localhost", port: 3431 },
};

export const appRouter = new AppRouter();

export async function serv(options: AppOptions = defaultOptions) {
  const blocks: Block[] = options?.blocks || [];
  for (const block of blocks) {
    // Sort routes: wildcard routes should be processed last
    appRouter.applyRoutes(block.routes || {}, block.path); // register routes dari block

    // Register middleware
    if (block.all) {
      appRouter.applyRoutes({ ["/*"]: block.all }, block.path);
    }
  }
  const host =
    options?.server?.host || defaultOptions.server?.host || "localhost";
  const port = options?.server?.port || defaultOptions.server?.port || 3431;
  createServer(appRouter, blocks, port, host);
}
``
export default {
  serv,
};
