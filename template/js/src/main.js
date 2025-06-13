import mainBlock from "./main.block.js";
import myd from "mydlib";

myd.serve({
  blocks: [mainBlock],
  config: {
    server: {
      host: "0.0.0.0",
      port: 3431,
    },
  },
});
