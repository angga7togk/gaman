export * from "./app";
export * from "./block";
export * from "./config";
export * from "./route";
export * from "./utils";

import { serve, serveSync } from "./app";

export default {
  serve,
  serveSync,
};
