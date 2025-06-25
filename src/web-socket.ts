import type { GamanBase } from "./gaman-base";
import type {
  AppConfig,
  BlockInterface,
  WebSocketContext,
} from "./types";
import { WebSocketServer } from "ws";
import { formatPath } from "./utils/utils";

export class GamanWebSocket<A extends AppConfig> {
  // * <path, WebSocketServer>
  private wss: { [path: string]: WebSocketServer } = {};

  constructor(private app: GamanBase<A>) {}

  getWebSocketServer(path: string): WebSocketServer | undefined {
    return this.wss[path];
  }

  registerWebSocketServer(block: BlockInterface<A>) {
    const path = formatPath(block.path || "/");
    if (this.wss[path]) {
      throw new Error(`WebSocketServer with path ${path} already exists!`);
    }
    const wss = new WebSocketServer({ noServer: true });
    if (typeof block.websocket !== "undefined") {
      wss.on("connection", async (ws) => {
        const _ws = ws as WebSocketContext;
        _ws.server = wss;
        const handle = await block.websocket?.(_ws);
        if (handle) {
          if (handle.onOpen) ws.on("open", handle.onOpen.bind(this));
          if (handle.onMessage) ws.on("message", handle.onMessage.bind(this));
          if (handle.onPong) ws.on("pong", handle.onPong.bind(this));
          if (handle.onError) ws.on("error", handle.onError.bind(this));
          if(handle.onRedirect) ws.on('redirect', handle.onRedirect.bind(this))
          if(handle.onClose) ws.on('close', handle.onClose.bind(this));
        }
      });
    }

    this.wss[path] = wss;
  }
}
