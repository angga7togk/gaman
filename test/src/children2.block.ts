import { defineBlock } from "../../dist";

export default defineBlock({
  path: "/anu",
  routes: {
    "/detail": () => ({ message: "OK" }),
  },
});
 