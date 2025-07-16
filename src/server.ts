import type {
	IBlock,
	Context,
	AppConfig,
	NextResponse,
	RoutesDefinition,
	AppOptions,
	IIntegration,
} from './types';
import http from 'node:http';
import { Log } from './utils/logger';
import { formatPath, isHtmlString } from './utils/utils';
import { Response } from './response';
import { sortArrayByPriority } from './utils/priority';
import { performance } from 'perf_hooks';
import { Color } from './utils/color';
import HttpError from './error/HttpError';
import { GamanWebSocket } from './web-socket';
import path from 'node:path';
import { GamanCookies } from './cookies';
import { IGNORED_LOG_FOR_PATH_REGEX } from './constant';
import { GamanAdapter } from './adapter';
import { detectRuntime } from './utils/runtime';
import { NodeAdapter } from './adapter/node';

export class Server<A extends AppConfig> {
	#blocks: IBlock<A>[] = [];
	#websocket: GamanWebSocket<A>;
	#integrations: Array<IIntegration<A>> = [];
	#adapter!: GamanAdapter<A>;

	private strict = false;

	constructor(private options: AppOptions<A>) {
		switch (detectRuntime()) {
			default:
				this.#adapter = new NodeAdapter<A>(this);
				break;
		}

		if (options.strict) {
			this.strict = options.strict;
		}
		this.#websocket = new GamanWebSocket(this);

		// Initialize integrations
		if (options.integrations) {
			for (const integration of options.integrations) {
				this.#integrations.push(integration);
				integration.onLoad?.(this.options);
			}
		}

		/**
		 * * EN: Initialize Blocks and childrens
		 * * ID: inisialisasi blocks dan childrens nya
		 */
		if (options.blocks) {
			for (const block of options.blocks) {
				const blockPath = block.path || '/';
				if (this.#blocks.some((b) => b.path === blockPath)) {
					throw new Error(`Block '${blockPath}' already exists!`);
				}

				if (block.websocket) {
					this.#websocket.registerWebSocketServer(block);
				}

				this.registerBlock({
					...block,
					path: blockPath,
				});

				// Initialize block childrens
				function initChilderns(basePath: string, childrens: Array<IBlock<A>>, app: Server<A>) {
					for (const blockChild of childrens) {
						const childPath = path.join(basePath, blockChild.path);
						if (app.#blocks.some((b) => b.path === childPath)) {
							throw new Error(`Block '${childPath}' already exists!`);
						}

						if (blockChild.websocket) {
							app.#websocket.registerWebSocketServer(blockChild);
						}

						app.registerBlock({
							...blockChild,
							path: childPath || '/',
						});

						/**
						 * * EN: initialize childerns from children
						 * * ID: inisialisasi childrens dari children
						 */
						if (blockChild.childrens) {
							initChilderns(childPath, blockChild.childrens, app);
						}
					}
				}
				// * init childrens
				initChilderns(blockPath, block.childrens || [], this);
			}
		}
	}

	getBlock(blockPath: string): IBlock<A> | undefined {
		const path = formatPath(blockPath, this.strict);
		const block: IBlock<A> | undefined = this.#blocks.find(
			(b) => formatPath(b.path, this.strict) === path,
		);
		return block;
	}

	registerBlock(block: IBlock<A>) {
		// * Kasih "/" di belakang nya kalau strict

		const _path = `${formatPath(block.path, this.strict)}${this.strict ? '/' : ''}`;
		this.#blocks.push({
			...block,
			path: _path,
		});
	}

	public async handleRequest(ctx: Context<A>) {
		Log.setRoute(ctx.request.url || '/');
		const startTime = performance.now();
		try {
			const blocksAndIntegrations = sortArrayByPriority<IBlock<A> | IIntegration<A>>(
				[...this.#blocks, ...this.#integrations],
				'priority',
				'asc', //  1, 2, 3, 4, 5 // kalau desc: 5, 4, 3, 2, 1
			);
			for await (const blockOrIntegration of blocksAndIntegrations) {
				if ('routes' in blockOrIntegration) {
					const block = blockOrIntegration as IBlock<A>;
					try {
						/**
						 * * Jika path depannya aja udah gak sama berarti gausah di lanjutin :V
						 */

						if (!(block.path && ctx.pathname.startsWith(block.path))) {
							continue;
						}

						if (block.includes) {
							for (const middleware of block.includes) {
								const result = await middleware(ctx);

								/**
								 * ? Kenapa harus di kurung di if(result){...} ???
								 * * Karena di bawahnya masih ada yang harus di proses seperti routes...
								 * * Kalau tidak di kurung maka, dia bakal jalanin middleware doang routesnya ga ke proses
								 */
								if (result) {
									return await this.handleResponse(result, ctx);
								}
							}
						}

						// Global middleware handler
						if (block.all) {
							const result = await block.all(ctx);

							/**
							 * ? Kenapa harus di kurung di if(result){...} ???
							 * * Karena di bawahnya masih ada yang harus di proses seperti routes...
							 * * Kalau tidak di kurung maka, dia bakal jalanin middleware doang routesnya ga ke proses
							 */
							if (result) {
								// * Set Status Log
								return await this.handleResponse(result, ctx);
							}
						}

						// Process routes
						const result = await this.handleRoutes(block.routes || {}, ctx, block.path);

						/**
						 * * Disini gausah di kurung seperti di block.all() tadi
						 * * Karna disini adalah respon akhir dari handle routes!
						 */
						if (result) {
							return await this.handleResponse(result, ctx);
						}
					} catch (error: any) {
						if (block.error) {
							// ! Block Error handler
							const result = await block.error(new HttpError(403, error.message), ctx);
							if (result) {
								return await this.handleResponse(result, ctx);
							}
						}
						Log.error(error);
						throw new HttpError(403, error.message);
					}
				} else if ('onRequest' in blockOrIntegration) {
					const integration = blockOrIntegration as IIntegration<A>;
					const result = await integration.onRequest?.(this.options, ctx);
					if (result) {
						return await this.handleResponse(result, ctx);
					}
				}
			}

			// not found
			return await this.handleResponse(undefined, ctx);
		} catch (error: any) {
			// ! Handler Error keseluruhan system

			if (this.options.error) {
				const result = await this.options.error(error, ctx);
				if (result) {
					return await this.handleResponse(result, ctx);
				}
			}
			Log.error(error.message);
			return await this.handleResponse(new Response(undefined, { status: 500 }), ctx);
		} finally {
			const endTime = performance.now();

			/**
			 * * kalau route dan status = null di tengah jalan
			 * * berarti gausah di kasih log
			 */
			if (
				Log.response.route &&
				Log.response.status &&
				!IGNORED_LOG_FOR_PATH_REGEX.test(Log.response.route)
			) {
				Log.log(
					`Request processed in ${Color.fg.green}(${(endTime - startTime).toFixed(
						1,
					)}ms)${Color.reset}`,
				);
			}
			Log.setRoute('');
			Log.setStatus(null);
		}
	}

	private async handleRoutes(
		routes: RoutesDefinition<A>,
		ctx: Context<A>,
		basePath: string = '/',
	): Promise<NextResponse> {
		for await (const [path, handler] of Object.entries(routes)) {
			/**
			 * * format path biar bisa nested path
			 * *
			 * * dan di belakang nya kasih "/" kalau dia strict
			 */
			const fullPath = `${formatPath(`${basePath}/${path}`, this.strict)}${this.strict ? '/' : ''}`;

			// * setiap request di createParamRegex nya dari path Server
			const regexParam = this.createParamRegex(fullPath);

			// ? apakah path dari client dan path server itu valid?
			// * pakai ctx.request.url biar responsif terhadap strict url semisal "/user/detail/" ada "/" di belakang
			const match = regexParam.regex.exec(ctx.request.url);

			/**
			 * * Jika match param itu tidak null
			 * * berarti di ctx.params[key] add param yang ada
			 */
			regexParam.keys.forEach((key, index) => {
				ctx.params[key] = match?.[index + 1] || '';
			});

			// * Jika ada BINTANG (*) berarti middleware
			const isMiddleware = fullPath.includes('*');

			/**
			 * * Jika dia middleware maka pake fungsi check middleware
			 * * Jika dia bukan middleware maka pake match
			 */
			const isValid = isMiddleware ? this.checkMiddleware(fullPath, ctx.pathname) : match !== null;

			/**
			 * * validasi (match) itu dari params
			 */
			if (Array.isArray(handler) && isValid) {
				/**
				 * * jalanin handler jika ($handler) adalah type Array<Handler> dan pathMatch valid
				 */
				for await (const handle of handler) {
					const result = await handle(ctx);
					if (result) return result; // Lanjut handler lain jika tidak ada respon
				}
			} else if (typeof handler === 'function' && isValid) {
				/**
				 * * jalanin handler jika ($handler) adalah type Handler dan pathMatch valid
				 */
				const result = await handler(ctx);
				if (result) return result; // Lanjut handler lain jika tidak ada respon
			} else if (typeof handler === 'object') {
				for await (const [methodOrPathNested, nestedHandler] of Object.entries(handler)) {
					/**
					 * * Jika dia bukan method berarti dia berupa nestedPath
					 */
					if (this.isHttpMethod(methodOrPathNested)) {
						/**
						 * * validasi (match) itu dari params
						 */
						if (Array.isArray(nestedHandler) && isValid) {
							for await (const handle of nestedHandler) {
								const result = await handle(ctx);
								if (result) return result;
							}
						} else if (typeof nestedHandler === 'function' && isValid) {
							const result = await nestedHandler(ctx);
							if (result) return result;
						}
					} else {
						// * Lakukan Proses Nested jika ada pathNested
						const result = await this.handleRoutes(
							{ [methodOrPathNested]: nestedHandler },
							ctx,
							fullPath,
						);

						/**
						 * * Kalau kalau dia ada result langsung response
						 * * Kalau gak ada lanjut ke route berikutnya...
						 */
						if (result) return result;
					}
				}
			}
		}
	}

	private async handleResponse(result: string | object | any[] | Response, ctx: Context<A>) {
		const isResponse = (value: unknown): value is Response => {
			return value instanceof Response;
		};

		/**
		 * * substitue result
		 * @default response 404
		 */
		let response: Response = new Response(null, { status: 404 });

		if (isResponse(result)) {
			response = result;
		} else {
			/**
			 * * intialize response without class Response
			 * @example return {message: "OK"}; or return "OK!";
			 */
			if (typeof result === 'string') {
				if (isHtmlString(result)) {
					response = Response.html(result, {
						status: 200,
					});
				} else {
					response = Response.text(result, {
						status: 200,
					});
				}
			} else if (result) {
				response = Response.json(result, {
					status: 200,
				});
			}
		}

		/**
		 * * proccess integrations first
		 */
		if (this.#integrations) {
			const integrations = sortArrayByPriority<IIntegration<A>>(
				this.#integrations,
				'priority',
				'asc',
			);

			for (const integration of integrations) {
				if (integration.onResponse) {
					const integrationResponse = await integration.onResponse(this.options, ctx, response);
					if (integrationResponse) {
						response = integrationResponse;
						break;
					}
				}
			}
		}

		/**
		 * set cookies
		 */
		const cookieHeaders = Array.from(GamanCookies.consume(ctx.cookies));
		if (cookieHeaders.length > 0) {
			response.headers.set('Set-Cookie', cookieHeaders);
		}

		const success = this.#adapter.handleResponse(ctx, response);
		if (success) {
			Log.setStatus(response.status);
		}
		return success;
	}

	listen() {
		// const server = http.createServer(this.handleRequest.bind(this));

		// server.on('upgrade', (request, socket, head) => {
		// 	const urlString = request.url || '/';
		// 	const { pathname } = new URL(urlString, `http://${request.headers.host}`);

		// 	const wss = this.#websocket.getWebSocketServer(pathname);
		// 	if (wss) {
		// 		wss.handleUpgrade(request, socket, head, function done(ws) {
		// 			wss.emit('connection', ws, request);
		// 		});
		// 	} else {
		// 		socket.destroy();
		// 	}
		// });

		const port = this.options?.server?.port || 3431;
		const host = this.options?.server?.host || 'localhost';
		this.#adapter.start(port, host, () => {
			Log.log(`Server is running at http://${host}:${port}`);
		});
	}

	/**
	 * Checks if a string is a valid HTTP method
	 * @param method - String to check
	 * @returns True if the string is a valid HTTP method
	 */
	private isHttpMethod(method: string): boolean {
		return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'ALL'].includes(method.toUpperCase());
	}

	private createParamRegex(path: string): {
		path: string;
		regex: RegExp;
		keys: string[];
	} {
		const paramKeys: string[] = [];
		const regexString = path
			.replace(/:([^/]+)/g, (_, key) => {
				paramKeys.push(key); // Simpan parameter dinamis
				return '([^/]+)'; // Konversi ke regex
			})
			.replace(/\//g, '\\/');

		const regexPath = new RegExp(`^${regexString}$`);
		return {
			path,
			regex: regexPath,
			keys: paramKeys,
		};
	}

	checkMiddleware(pathMiddleware: string, pathRequestClient: string): boolean {
		// Escape special regex characters except '*'
		const escapedPath = pathMiddleware.replace(/[-/\\^$+?.()|[\]{}]/g, '\\$&');

		// Replace '*' with regex wildcard
		const pattern = `^${escapedPath.replace(/\*/g, '.*')}$`;

		// Create a regex from the pattern
		const regex = new RegExp(pattern);

		// Test the client request path against the regex
		return regex.test(pathRequestClient);
	}
}
