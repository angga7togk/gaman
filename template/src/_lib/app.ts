import express from "express";
import { applyRoutes} from "./route";
import { MydConfig } from "./config";
import { MydBlock } from "./block";
import { Logger } from "./utils";

export * from "./block";
export * from "./config";
export * from "./route";
export * from "./utils";

export const app = express();

export interface AppOptions {
  blocks?: MydBlock[];
  pre?: (app: express.Express) => any;
  onListen?: (app: express.Express, error?: Error) => void;
  config?: MydConfig;
}
export default function App(res?: AppOptions): express.Express {
  const config = res?.config || {};

  res?.pre?.(app);

  if (res?.blocks) {
    res?.blocks.map((block) => {
      if (block.middlewares) {
        app.use(block.middlewares);
      }
      if (block.routes) {
        applyRoutes(app, block.routes, block.path);
      }
    });
  }

  const port = config.server?.port || 3431;
  app.listen(port, config.server?.host || "localhost", (error) => {
    Logger.info(`Server is running on http://localhost:${port}`);
    res?.onListen?.(app, error);
  });

  return app;
}
