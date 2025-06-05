import express from "express";
import config from "../../myd.config"
import { applyRoutes } from "_lib/decorators/routes/func";
import controllers from "controllers";

export const app = express();

const port = config.server?.port || 3431;

applyRoutes(app, controllers);

app.listen(port, config.server?.host || "localhost", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default function App(): express.Express {
  return app;
}
