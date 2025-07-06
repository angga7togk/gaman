import { defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/content",
  routes: {
    "/": {
      GET: () => Response.text("content block works!"),
    },
  },
});
