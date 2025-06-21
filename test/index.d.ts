import type { GamanBase } from "../src/gaman-base";

declare global {
  namespace Gaman {
    interface Locals {
      anu: string;
    }

    interface Env {}
  }
}

export {};
