import gaman, { defineBlock, Response } from "../src";
const blocks = defineBlock({
  routes: {
    "/": (ctx) => {
      ads;
      return "asdasd";
    },
    // Middleware with path
    "/article/*": (ctx) => {
      ctx.locals.userName = "Angga7Togk"; // set data locals
    },
    "/article": {
      POST: [
        async (ctx) => {
          const json = await ctx.json();
          return Response.json(json /**return JSON */, { status: 200 });
        },
      ],
      "/json": {
        GET: (ctx) => {
          const userName = ctx.locals.userName;

          // return like Response.json()
          return {
            user_name_from_local: userName,
          };
        },
      },

      "/text": {
        GET: (ctx) => {
          const userName = ctx.locals.userName;

          // return like Response.text()
          return userName;
        },
      },
    },
  },
});
gaman.serv({
  server: {
    port: 3441,
  },
  blocks: [blocks],

  error: (err, ctx) => {
    return Response.json({ message: "Internal server erro!" }, { status: 500 });
  },
});
