import mainBlock from "./main.block.js";
import gaman from "../../dist/esm/index.js";

gaman.serv({
  blocks: [mainBlock],
  server: {
    port: 3431,
  },
});
