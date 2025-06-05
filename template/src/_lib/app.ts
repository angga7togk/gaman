import express, { RequestHandler } from "express";
import config from "../../myd.config";
import { applyRoutes } from "myd/router";
import controllers from "controllers";

export const app = express();

const port = config.server?.port || 3431;

interface AppOptions {
  pre?: (app: express.Express) => void;
  middlewares?: express.RequestHandler[];
  onListen?: (app: express.Express, error?: Error) => void;
}
export default function App(res?: AppOptions): express.Express {
  res?.pre?.(app);
  if (res?.middlewares) {
    app.use(res?.middlewares);
  }

  // nganu semua routes atau kontroller
  applyRoutes(app, controllers);

  app.listen(port, config.server?.host || "localhost", (error) => {
    console.log(`Server is running on http://localhost:${port}`);
    res?.onListen?.(app, error);
  });

  return app;
}
