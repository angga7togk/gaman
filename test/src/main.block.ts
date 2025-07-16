import { defineBlock, Response } from 'gaman';

export default defineBlock({
	path: '/',
	routes: {
		'/': async (ctx) => {

			return {
				'msg:': ctx.request.body,
			};
		},
	},
});
