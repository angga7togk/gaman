import express from "express";
import { MydConfig } from "./config";
import { applyBlocks, MydBlock } from "./block";
import { Logger } from "./utils";

export interface AppOptions {
  blocks?: MydBlock[];
  pre?: (app: express.Express) => any | Promise<any>;
  onListen?: (app: express.Express, error?: Error) => any | Promise<any>;
  config?: MydConfig;
}

// Asynchronous server
export async function serve(options?: AppOptions): Promise<express.Express> {
  const app = express();
  const config = options?.config || {};

  if (options?.pre) {
    await options.pre(app);
  }

  applyBlocks(app, options?.blocks || []);

  const port = config.server?.port || 3431;
  app.listen(port, config.server?.host || "localhost", async (error) => {
    Logger.info(`Server is running on http://localhost:${port}`);
    await options?.onListen?.(app, error);
  });
  return app;
}

// Synchronous server
export function serveSync(options: AppOptions): express.Express {
  const app = express();
  const config = options?.config || {};

  if (options?.pre) {
    const preResult = options.pre(app);
    if (preResult instanceof Promise) {
      throw new Error("Pre function in serveSync must not be asynchronous.");
    }
  }

  applyBlocks(app, options?.blocks || []);

  const port = config.server?.port || 3431;
  app.listen(port, config.server?.host || "localhost", (error) => {
    Logger.info(`Server is running on http://localhost:${port}`);
    if (options?.onListen) {
      const onListenResult = options.onListen(app, error);
      if (onListenResult instanceof Promise) {
        throw new Error("onListen function in serveSync must not be asynchronous.");
      }
    }
  });

  return app;
}
