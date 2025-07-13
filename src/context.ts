import http from 'node:http';
import querystring from 'node:querystring';
import type { Context, AppConfig } from './types';
import { FormData, type IFormDataEntryValue } from './utils/form-data';
import Busboy from 'busboy'; // Import Busboy
import { GamanHeaders } from './headers';
import { GamanCookies } from './cookies';
import { HTTP_REQUEST_SYMBOL, HTTP_RESPONSE_SYMBOL } from './symbol';

export async function createContext<A extends AppConfig>(
	req: http.IncomingMessage,
	res: http.ServerResponse,
): Promise<Context<A>> {
	const urlString = req.url || '/';
	const method = req.method || 'GET';
	const url = new URL(urlString, `http://${req.headers.host}`);
	const contentType = req.headers['content-type'] || '';
	const headers = new GamanHeaders(req.headers);

	/** FormData state */
	let form: FormData = null;
	const formData = async () => {
		if (form !== null) {
			return form;
		}

		if (contentType.includes('application/x-www-form-urlencoded') && method !== 'HEAD') {
			form = parseFormUrlEncoded(parsedBody.raw?.toString() || '{}');
		} else if (contentType.includes('multipart/form-data') && method !== 'HEAD') {
			const formData = await parseMultipartFormWithBusboy(req);
			form = formData;
		} else {
			form = new FormData();
		}
		return form;
	};

	let parsedBody: {
		json?: any;
		raw?: Buffer;
	} = {};

	// Perubahan di sini: Hanya bufferize jika BUKAN multipart/form-data
	if (!(contentType.includes('multipart/form-data') && method !== 'HEAD')) {
		const bodyBuffer = await getRequestBodyBuffer(req);
		parsedBody = parseRequestBody(bodyBuffer, contentType, method);
	}

	const gamanRequest = {
		method,
		url: urlString,
		pathname: url.pathname,
		headers: headers,
		header: (key: string) => headers.get(key),
		query: Object.fromEntries(url.searchParams.entries()),
		params: {}, // akan di set dari router
		// body akan menjadi raw buffer untuk non-multipart, atau null/undefined untuk multipart
		body: parsedBody.raw || null,
		json: async <T>() => {
			return parsedBody.json ? (parsedBody.json as T) : ({} as T);
		},
		formData,
		ip: req.socket.remoteAddress || '',
		raw: req,
	};
	const ctx = {
		locals: <A['Locals']>{},
		env: <A['Env']>{},
		request: gamanRequest,
		pathname: gamanRequest.pathname,
		json: gamanRequest.json,
		params: gamanRequest.params,
		query: gamanRequest.query,
		header: gamanRequest.header,
		headers: gamanRequest.headers,
		cookies: new GamanCookies(gamanRequest),
		url,
		input: async (name: string) => (await formData()).get(name)?.asString(),
		[HTTP_REQUEST_SYMBOL]: req,
		[HTTP_RESPONSE_SYMBOL]: res,
	};
	return ctx;
}

async function getRequestBodyBuffer(req: http.IncomingMessage): Promise<Buffer> {
	const chunks: Buffer[] = [];
	return new Promise((resolve, reject) => {
		req.on('data', (chunk) => chunks.push(chunk));
		req.on('end', () => resolve(Buffer.concat(chunks)));
		req.on('error', reject);
	});
}

// Fungsi ini tetap sama, mem-parse body buffer untuk JSON dan URL-encoded
function parseRequestBody(
	bodyBuffer: Buffer,
	contentType: string,
	method: string,
): {
	json?: any;
	raw?: Buffer;
} {
	if (contentType.includes('application/json') && method !== 'HEAD') {
		try {
			return { json: JSON.parse(bodyBuffer.toString()), raw: bodyBuffer };
		} catch {
			return { raw: bodyBuffer };
		}
	}

	// Penting: Bagian ini DIHAPUS karena multipart ditangani langsung di nodeHandler
	// if (contentType.includes("multipart/form-data") && method !== "HEAD") {
	//   const boundary = getMultipartBoundary(contentType);
	//   if (!boundary) throw new MultipartParseError("Missing multipart boundary");
	//   const stream = parseMultipartForm(bodyBuffer, boundary); // Ini akan dihapus
	//   return { formData: stream };
	// }

	return { raw: bodyBuffer };
}

function parseFormUrlEncoded(body: string): FormData {
	const data = querystring.parse(body);
	const result = new FormData();
	for (const [key, value] of Object.entries(data)) {
		if (Array.isArray(value)) {
			const _values: IFormDataEntryValue[] = value.map((v) => ({
				name: key,
				value: v as string, // Cast to string since querystring.parse returns string | string[]
			}));
			result.setAll(key, _values);
		} else {
			result.set(key, {
				name: key,
				value: (value as string) || '',
			});
		}
	}
	return result;
}

// --- Fungsi Baru untuk Busboy ---
async function parseMultipartFormWithBusboy(req: http.IncomingMessage): Promise<FormData> {
	const formData = new FormData();

	return new Promise((resolve, reject) => {
		const busboy = Busboy({ headers: req.headers });

		busboy.on('file', (name, fileStream, info) => {
			const { filename, mimeType } = info;
			const fileChunks: Buffer[] = [];
			fileStream.on('data', (chunk) => {
				fileChunks.push(chunk);
			});
			fileStream.on('end', () => {
				const fileBuffer = Buffer.concat(fileChunks);
				formData.set(name, {
					name: name,
					filename: filename,
					mimetype: mimeType,
					// Menggunakan Blob karena GamanFormData.value menerima Blob
					value: new Blob([fileBuffer], { type: mimeType }),
				});
			});
			fileStream.on('error', reject);
		});

		busboy.on('field', (name, val) => {
			formData.set(name, {
				name,
				value: val,
			});
		});

		busboy.on('finish', () => {
			resolve(formData);
		});

		busboy.on('error', reject);

		// Sangat penting: Alirkan request stream ke busboy
		req.pipe(busboy);
	});
}
