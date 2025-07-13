import type { AppConfig, IBlock } from "../types";

export function defineBlock<A extends AppConfig>(
  block: IBlock<A>
): IBlock<A> {
  return block;
}
