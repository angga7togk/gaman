import children2Block from "children2.block";
import { defineBlock } from "../../dist";

export default defineBlock({
  path: "/anu",
  childrens: [children2Block],
  routes: {
    "/detail": () => ({ message: "OK" }),
  },
});
