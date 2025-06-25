import { AppConfig, RoutesDefinition } from "../types";

export function defineTree<A extends AppConfig>(routes: RoutesDefinition<A>): RoutesDefinition<A> {
  return routes;
}
