import { Response } from '../response';
import { Server } from '../server';
import { AppConfig, Context } from '../types';

// core/adapter.ts
export abstract class GamanAdapter<A extends AppConfig> {
	constructor(private server: Server<A>) {}

	public getServer(): Server<A> {
		return this.server;
	}

	abstract start(port: number, host: string, fn?: () => void): any;

	/**
	 * Parses the native request into a GamanContext object.
	 */
	abstract createContext(nativeRequest: any): Promise<Context<A>>;

	/**
	 * Converts the handler result into a native response format.
	 */
	abstract handleResponse(ctx: Context<A>, response: Response): boolean;
}
