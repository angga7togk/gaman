import ejs from "@gaman/ejs";
import staticFileIntegration from "@gaman/static";
import gaman, { defineBlock, Response } from "gaman";
import { cors } from "@gaman/cors";
const blocks = defineBlock({
  includes: [cors({ origin: "*" })],
  routes: {
    "/": async (ctx) => {
      return {
        msg: "OK!",
      };
    },
  },
});
gaman.serv({
  integrations: [
    ejs({
      viewPath: "custom/views", // default: 'src/views',
      // ada opsion lain tapi dari @url https://github.com/mde/ejs?tab=readme-ov-file#options
    }),
  ],
  blocks: [blocks],
});
