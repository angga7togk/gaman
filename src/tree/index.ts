import { AppConfig, Handler, Router, RoutesDefinition } from '../types';

/**
 * Defines a route tree structure that can be either a RoutesDefinition,
 * a Router object, a single Handler, or an array of Handlers.
 *
 * This utility helps with type inference and validation when defining nested
 * routes or modular routing blocks in a GamanJS application.
 *
 * @template T - The accepted route definition type (RoutesDefinition, Router, Handler, or Handler[]).
 * @template A - The application config type extending AppConfig.
 * @param obj - The routing configuration to define.
 * @returns The same routing structure with proper typing.
 */
export function defineTree<
	T extends RoutesDefinition<A> | Router<A> | Handler<A> | Handler<A>[],
	A extends AppConfig,
>(obj: T): T {
	return obj;
}
