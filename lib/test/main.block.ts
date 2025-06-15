import { defineBlock } from "../src/block/block";
import mainTree from "./tree/main.tree";

export default defineBlock({
  path: "/",
  all: () => {
    console.log("Anu sa");
  },
  routes: {
    "/": async (ctx) => {
      return Res.json({ message: "Welcome to the homepage" });
    },
    "/1": {
      GET: (ctx) => {
        return Res.json({ no: 1 });
      },
      "/2": {
        GET: (ctx) => {
          return Res.json({ no: 2 });
        },
        "/3": {
          GET: (ctx) => {
            return Res.json({ no: 3 });
          },
        },
      },
    },
    "/about/*": () => {
      return Res.json({ message: "OK" });
    },
    "/about/jir": {
      GET: () => {
        return Res.text("Berhas si");
      },
    },
    "/api": mainTree,
  },
});
