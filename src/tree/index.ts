import { AppConfig, Handler, Router } from '../types';

export function defineTree<A extends AppConfig>(
	routes: Router<A> | Handler<A> | Handler<A>[],
): Router<A> | Handler<A> | Handler<A>[] {
	return routes;
}
