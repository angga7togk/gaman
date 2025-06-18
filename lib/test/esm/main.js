import mainBlock from "./main.block.js";
import gaman from "../../dist/index.js";

gaman.serv({
  blocks: [mainBlock],
  server: {
    port: 3431,
  },
});
