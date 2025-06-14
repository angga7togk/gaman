export * from "./app";
export * from "./block";
export * from "./config";
export * from "./router/index";
export * from "./utils";

import { serve, serveSync } from "./app";

export default {
  serve,  
  serveSync,
};
