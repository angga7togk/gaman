import { Logger, defineBlock, Response } from "../src/index";

export default defineBlock({
  path: "/",
  all: () => {
    Logger.log("middleware ALL");
  },
  routes: {
    "*": (ctx) => {
      Logger.debug("Debug coy hahahaha")
      Logger.log("asdada");
      // ctx.cookies.set('saadsadadadsaadadadd', 'aku-gsad', {expires: '10s'})
    },
    "/": async (ctx) => {
      return Response.json({ message: "Article ID" });
    },
    "/article/:id": {
      GET: () => {

          asda
        return Response.json({ message: "Article ID" });
      },
      POST: [
        (ctx) => { 
          return Response.json(ctx.request.json /**return JSON */, {
            status: 200,
          });
        },
      ],
      "/detail": (ctx) => {
        return Response.json({
          message: ctx.params /** $ID from "/user/:id" */,
        });
      },
    },
  },
  error(error) {
    Logger.error(error.message);
    return Response.json(
      { message: "Internal server error!" },
      { status: 500 }
    );
  },
});
