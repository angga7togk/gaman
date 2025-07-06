import { defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/user",
  routes: {
    "/": {
      GET: () => Response.text("user block works!"),
    },
  },
});
