import { Response } from "../src";
import { defineBlock } from "../src/block/block";
import mainTree from "./tree/main.tree";

export default defineBlock({
  path: "/",
  routes: {
    "/": async (ctx) => {
      Response.json({ message: "Welcome to the homepage" });
    },
    "/1": {
      GET: (ctx) => {
        Response.json({ no: 1 });
      },
      "/2": {
        GET: (ctx) => {
          Response.json({ no: 2 });
        },
        "/3": {
          GET: (ctx) => {
            Response.json({ no: 3 });
          },
        },
      },
    },
    "about/jir": () => {
      Response.text("Berhas si");
    },
    "/api": mainTree,
  },
});
