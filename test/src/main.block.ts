import { defineBlock, Response } from "gaman";

export default defineBlock({
  routes: {
    "/": () => Response.json({ message: "Haia sd asdaasdd" }),
  },
});
