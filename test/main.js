const { defineBlock, Response } = require("../dist/cjs/index.js");
const gaman = require("../dist/cjs/index.js");

const blocks = defineBlock({
  path: "/",
  routes: {
    "/user/detail": () => {
      return Response.json({
        message: "OK HAHAH!",
      });
    },
    "/": () => {
      return Response.json({
        message: "OK!",
      });
    },
  },
  websocket: async (ctx) => {
    return {
      onOpen: () => {
        console.log("asdadadadada");
      },
      onMessage: (data) => {
        ctx.send(data.toString());
      },
      onClose: () => {
        console.log("asdada");
      },
    };
  },
});
gaman.serv({
  host: "localhost",
  port: 3431,
  blocks: [blocks],
});
