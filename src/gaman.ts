
import { Server } from "./server";
import type { AppConfig, AppOptions } from "./types";

const defaultOptions = {
  server: {
    host: "localhost",
    port: 3431,
  },
};

export function serv<A extends AppConfig>(
  options: AppOptions<A> = defaultOptions
): Server<A> {
  const app = new Server<A>(options);
  app.listen();

  return app;
}
