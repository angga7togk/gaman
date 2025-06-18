import http from "http";
import { AppRouter } from "../router/AppRouter";
import nodeHandler from "../handler/http/nodeHandler";
import { getNetworkAddress } from "../utils/networkUtils";
import bunHandler from "../handler/http/bunHandler";
import { Logger } from "../utils/Logger";
import { Block } from "../block/block";
import { Color } from "../utils/Color";

export function createServer(
  appRouter: AppRouter,
  blocks: Block[],
  port: number,
  host: string
) {
  if (typeof Bun !== "undefined") {
    const srv = Bun.serve({
      port,
      hostname: host,
      fetch: async (request, server) => {
        const res = await bunHandler(appRouter, blocks, request, server);
        return res
          ? new Response(res.getBody(), {
              status: res.getStatus(),
              statusText: res.getStatusText(),
              headers: res.getHeaders(),
            })
          : new Response("404 Not Found", { status: 404 });
      },
    });
    printServerMessage(srv.hostname || "localhost", srv.port || port)
  } else {
    const srv = http.createServer(async (req, res) => {
      const _res = await nodeHandler(appRouter, blocks, req);

      res.writeHead(
        _res?.getStatus() || 404,
        _res?.getStatusText() || "",
        _res?.getHeaders() || {}
      );
      return res.end(_res?.getBody() || "404 Not Found");
    });

    srv.listen(port, host, () => {
      const _a = srv.address() as any;
      printServerMessage(_a.address, _a.port || port)
    });
  }
}

function printServerMessage(host: string, port: number) {
  const address = getNetworkAddress(host, port);
  Logger.log(`Server local is running on ${Color.underline}${Color.fg.blue}http://localhost:${address?.port || port}${Color.reset}`);
  if (address) {
    Logger.log(
      `Server network is running on ${Color.underline}${Color.fg.blue}http://${address.host}:${address.port || port}${Color.reset}`
    );
  }
}
