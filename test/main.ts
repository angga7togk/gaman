import defineBlock from "../src/block/defineBlock";
import { serv } from "../src/gaman";
import { Response } from "../src/response";
import { basicAuth } from "../src/middleware/basic-auth";

const blocks = defineBlock({
  path: "/",
  all: (ctx) => {},
  includes: [
    basicAuth({
      username: "my",
      password: "abogoboga",
    }),
  ],
  routes: {
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

serv({
  blocks: [blocks],
  error: (error, ctx) => {
    return Response.json(
      { message: "Internal Server Error!" },
      { status: 500 }
    );
  },
});
