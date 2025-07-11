import childrenBlock from "children.block";
import { defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/aduhai",
  childrens: [childrenBlock],
  routes: {
    "/": () => Response.json({ message: "Haia sd asdaasdd" }),
  },
});
