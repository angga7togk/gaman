export * from "./app";
export * from "./block/block";
export * from "./router/router";
export * from "./router/AppRouter";
export * from "./router/request/request";
export * from "./router/request/requestExpand";
export * from "./router/request/requestParsing";
export * from "./router/response/response";
export * from "./utils/Logger";
export * from "./tree/tree";
export * from "./handler/requestHandler"
// export * from "./middleware/middleware";

declare global {
  var Res: typeof Response;
}
global.Res = Response as any;

import { serv } from "./app";
import { Response } from "./router/response/response";
export default {
  serv,
  serve: serv,
};
