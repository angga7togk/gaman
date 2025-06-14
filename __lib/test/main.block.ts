import { defineBlock } from "../src";

export default defineBlock({
  routes: {
    "/": (req, res) => {
      res.json({ sad: "sadad" });
    },
  },
});
