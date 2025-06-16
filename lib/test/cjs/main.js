const mainBlock = require("./main.block.js");
const gaman = require("../../dist/cjs/index.js");

gaman.serv({
  blocks: [mainBlock],
  server: {
    port: 3431,
  },
});
