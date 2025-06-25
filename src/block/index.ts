import type { AppConfig, BlockInterface } from "../types";

export function defineBlock<A extends AppConfig>(
  block: BlockInterface<A>
): BlockInterface<A> {
  return block;
}
