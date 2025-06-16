import { createRequest } from "./router/request/requestExpand";
import { Response } from "./router/response/response";
import type { Block } from "./block/block";
import { AppRouter } from "./router/AppRouter";
import { getNetworkAddress } from "./utils/networkUtils";
import { createServer } from "./server/server";
import { requestHandler } from "./handler/requestHandler";

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

export async function serv(options: AppOptions = defaultOptions): Promise<any> {
  const blocks: Block[] = options?.blocks || [];
  for (const block of blocks) {
    // Sort routes: wildcard routes should be processed last
    appRouter.applyRoutes(block.routes || {}, block.path); // register routes dari block

    // Register middleware
    if (block.all) {
      appRouter.applyRoutes({ ["/*"]: block.all }, block.path);
    }
  }

  const server = createServer(async (__req, __res) => {
    Response.__createHttpResponse(__res); // init server response
    const req = await createRequest(appRouter, __req);

    requestHandler(appRouter, {
      request: req,
      params: req.params,
      query: req.query,
    });

    // Jika tidak ada route yang cocok
    return Response.text("404 Not Found", { status: 404 });
  });

  const host = options.server?.host || defaultOptions.server?.host;
  const port = options.server?.port || defaultOptions.server?.port!;
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
