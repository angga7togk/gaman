import childrenBlock from "children.block";
import { defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/",
  routes: {
    "/": async (ctx) => {
      const gamertag = await ctx.input('gamertag');
      return {
        gamertag
      }
    },
    "/login": () => "anjay",
  },
});
