import { AppConfig, IIntegration } from "../types";

export function defineIntegration<A extends AppConfig>(
  integration: IIntegration<A>
): IIntegration<A> {
  return integration;
}
