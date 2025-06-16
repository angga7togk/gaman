import apiTree from "./tree/api.tree";
import { Logger, defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/", // base path
  all: async (ctx, next) => {
    Logger.log("anu1");
    return next();
  },
  routes: {
    "*": {
      GET: async (ctx, next) => {
        Logger.log("anu2");
        return next();
      },
    },
    "/1": {
      POST: (ctx) => {
        new Response("Hahah", { status: 200 }).send();
      },
      "/2": {
        GET: (ctx) => {
          return Response.json({ no: 2 });
        },
        "/3": {
          GET: (ctx) => {
            return Response.json({ no: 3 });
          },
        },
      },
    },
    "/about/*": {
      POST: (ctx, next) => {
        Logger.log("about post middleware");
        next();
      },
    },
    "/about": (ctx, next) => {
      Logger.log("haha");
      next();
    },
    "/jir/about": {
      GET: () => {
        return Response.text("Berhas si");
      },
    },
    "/api": apiTree,
  },
});
