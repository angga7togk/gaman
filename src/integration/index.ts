import { AppConfig, IntegrationInterface } from "../types";

export function defineIntegration<A extends AppConfig>(
  integration: IntegrationInterface<A>
): IntegrationInterface<A> {
  return integration;
}
