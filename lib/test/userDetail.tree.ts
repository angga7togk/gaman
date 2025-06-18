import {defineTree} from "../dist/index";

export default defineTree({
  ALL: (ctx) => {
    return Response.json({ message: "OK!" });
  },
  "/detail": {
    GET: (ctx) => {
      return Response.json({ message: "Detail Get User" });
    },
    "/super-detail": {
      GET: (ctx) => {
        return Response.json({ message: "Super-Detail Get User" });
      },
    },
  },
});
