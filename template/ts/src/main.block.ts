import { defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/user",
  middlewares: [], // similar to express.use()
  routes: {
    "/":(ctx) => {
      Response.json({ message: "❤️ Welcome to MyD.JS" });
    },

    "/article/:id": {
      GET: (ctx) => {
        Response.json({ message: "Article ID" });
      },
      POST: [
        (ctx) => {
          Response.json(ctx.request.body /**return JSON */);
        },
      ],
      "/detail": {
        GET: (ctx) => {
          Response.json({ message: ctx.request.params.id /** $ID from "/user/:id" */ });
        },
      },
    },
  },
});
