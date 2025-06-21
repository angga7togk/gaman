import type { Block } from "./block/block";
import { AppPlugin } from "./plugin/AppPlugin";
import { GamanPlugin } from "./plugin/plugin";
import { AppRouter } from "./router/AppRouter";
import { RequestHandler } from "./router/router";
import { createServer } from "./server/server";
import { Logger } from "./utils/Logger";

export interface App {
  plugins?: Array<new (app: App) => GamanPlugin>,
  server?: {
    host?: string;
    port?: number;
  };
  blocks?: Block[];
}

const defaultOptions: App = {
  server: { host: "localhost", port: 3431 },
};

export const appPlugin = new AppPlugin();
export const appRouter = new AppRouter();

export async function serv(options: App = defaultOptions) {
  const blocks: Block[] = options?.blocks || [];
  for (const block of blocks) {
    // Sort routes: wildcard routes should be processed last
    appRouter.applyRoutes(block.routes || {}, block.path); // register routes dari block

    // Register middleware
    if (block.all) {
      appRouter.applyRoutes({ ["*"]: block.all }, block.path);
    }
  }
  if(options.plugins){
    for(const pluginClass of options.plugins){
      const plugin = new pluginClass(options);
      await plugin.onStart();
      appRouter.applyRoutes({["*"]: plugin.onRequest as RequestHandler})
      Logger.debug(`Plugin "${plugin.name}" has been successfully registered.`)
      appPlugin.register(plugin);
    }
  }
  const host =
    options?.server?.host || defaultOptions.server?.host || "localhost";
  const port = options?.server?.port || defaultOptions.server?.port || 3431;
  createServer(appRouter, blocks, port, host);
}
``
