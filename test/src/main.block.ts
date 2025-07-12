import childrenBlock from "children.block";
import { defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/",
  routes: {
    "/": async (ctx) => {
      return Response.redirect("/login");
    },
    "/login": () => "anjay",
  },
});
