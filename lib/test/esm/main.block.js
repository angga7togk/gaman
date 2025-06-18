import { defineBlock, Response } from "../../dist/index.js";

export default defineBlock({
  path: "/",
  all: (ctx) => {
    console.log("middleware ALL");
  },
  routes: {
    "/": {
      POST: async (ctx) => {
        const data = await ctx.formData();
        console.log(data.get("fafafa")?.value);

        return Response.json(data.get("fafafa"));
      },
    },

    "/article/:id": {
      GET: (ctx) => {
        Response.json({ message: "Article ID" });
      },
      POST: [
        (ctx) => {
          Response.json(ctx.request.json /**return JSON */, { status: 200 });
        },
      ],
      "/detail": {
        GET: (ctx) => {
          Response.json({
            message: ctx.request.pathname /** $ID from "/user/:id" */,
          });
        },
      },
    },
  },
});
