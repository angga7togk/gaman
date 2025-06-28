import gaman, { defineBlock, Response } from "../src";
import ejsInt from "./ejs";
const blocks = defineBlock({
  routes: {
    "/": async (ctx) => {
      return Response.render("index", { title: "Welcome to GamanJS" });
    },
  },
});
gaman.serv({
  integrations: [ejsInt],
  server: {
    port: 3441,
  },
  blocks: [blocks],

  error: (err, ctx) => {
    return Response.json({ message: "Internal server erro!" }, { status: 500 });
  },
});
