import { Response, defineTree } from "gaman";

export default defineTree({
  "/tes": {
    GET: () => Response.json({ Aduhai: "sda" }, {
      status: 200
    }),
  },
});
