import { GamanBase } from "./gaman-base";
import type { AppConfig, AppOptions } from "./types";

const defaultOptions = {
  server: {
    host: "localhost",
    port: 3431,
  },
};

export function serv<A extends AppConfig>(
  options: AppOptions<A> = defaultOptions
): GamanBase<A> {
  const app = new GamanBase<A>(options);
  for (const block of options.blocks || []) {
    app.registerBlock(block as any);
  }
  app.listen();

  return app;
}
