import childrenBlock from "children.block";
import { defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/",
  routes: {
    "/": async (ctx) => {
      const formData = await ctx.request.formData();
      console.log(formData.get("email")?.value);
      return {
        email: await formData.get('email')?.asFile().text()
      };
    },
  },
});
