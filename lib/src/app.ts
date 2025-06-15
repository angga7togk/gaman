import http from "http";
import { createRequest } from "./router/request/requestExpand";
import { Response } from "./router/response/response";
import type { Block } from "./block/block";
import AppRouter from "./router/AppRouter";
import { getNetworkAddress } from "./utils/networkUtils";

export interface Config {
  server?: {
    host?: string;
    port?: number;
  };
}

export interface AppOptions {
  blocks?: Block[];
  // pre?: (app: express.Express) => any | Promise<any>;
  // onListen?: (app: express.Express, error?: Error) => any | Promise<any>;
  config?: Config;
}

const defaultOptions: AppOptions = {
  config: {
    server: {
      host: "localhost",
      port: 3431,
    },
  },
};

const appRouter = new AppRouter();

// Asynchronous server
export async function serv(options: AppOptions = defaultOptions): Promise<any> {
  const blocks: Block[] = options?.blocks || [];
  for (const block of blocks) {
    // Sort routes: wildcard routes should be processed last
    const routes = block.routes || {};
    if (block.all) {
      routes["*"] = block.all;
    }
    appRouter.applyRoutes(routes || {}, block.path); // register routes dari block
  }

  const server = http.createServer(async (__req, __res) => {
    Response.__setServerResponse(__res); // init server response
    const req = await createRequest(appRouter, __req);

    const method = req.method;
    const url = req.url;

    // ngambil routes yang udha di register si blocks
    for (const route of appRouter.getRoutes()) {
      const match = route.regexPath.exec(url);
      if (match && (route.method === method || route.method === "ALL")) {
        for (const handler of route.handlers) {
          const res = await handler({
            request: req,
            params: req.params,
            query: req.query,
          });
          if (typeof res === "boolean") {
            return;
          }
        }
        return;
      }
    }
    // Jika tidak ada route yang cocok
    return Response.status(404).text("404 Not Found");
  });

  const host =
    options.config?.server?.host || defaultOptions.config?.server?.host;
  const port =
    options.config?.server?.port || defaultOptions.config?.server?.port!;
  server.listen(port, host, () => {
    const address = getNetworkAddress(host, port);
    const mode = (process.env.NODE_ENV as any) || "development";

    const logMessage = `
\x1b[36m> Ready on:\x1b[0m
  \x1b[32mLocal:\x1b[0m      http://localhost:${port}
  ${
    address
      ? `\x1b[32mNetwork:\x1b[0m    http://${address.host}:${address.port}`
      : "\x1b[31mNetwork:\x1b[0m    Unavailable"
  }
\x1b[36mEnvironment:\x1b[0m ${mode || "development"}
`;

    console.log(logMessage.trim());
  });
}

export default {
  serv,
};
