import type { AppConfig, BlockInterface, WebSocketServerHandler } from "../types";

export default function defineBlock<A extends AppConfig>(
  block: BlockInterface<A>
): BlockInterface<A> {
  return block;
}
