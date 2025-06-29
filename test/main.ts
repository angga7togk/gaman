import gamanEJS from "@gaman/ejs";
import staticFileIntegration from "@gaman/static";
import gaman, { defineBlock, Response } from "gaman";
const blocks = defineBlock({
  routes: {
    "/": async (ctx) => {
      return Response.render("index", { title: "Welcome to GamanJS" });
    },
  },
});
gaman.serv({
  integrations: [staticFileIntegration(), gamanEJS({
    viewPath: 'test/views'
  })],
  server: {
    port: 3441,
  },
  blocks: [blocks],

  error: (err, ctx) => {
    return Response.json({ message: "Internal server erro!" }, { status: 500 });
  },
});
