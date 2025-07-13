import { base64UrlEncode } from "./utils";
import crypto from "node:crypto";

/**
 * Create a signature token
 * @param payload - Data to include in the token
 * @param secret - Secret key for signing the token
 * @param alg - Algorithm (default: HS256)
 */
export function createSignature(payload: object, secret: crypto.BinaryLike): string {
  // Encode Payload
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac("sha256", secret) // Use HMAC-SHA256 (HS256)
    .update(encodedPayload)
    .digest("base64");

  const encodedSignature = base64UrlEncode(signature);

  // Combine all parts
  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Verify a signature token
 * @param token - signature token
 * @param secret - Secret key for verification
 */
export function verifySignature(token: string, secret: crypto.BinaryLike): boolean {
  const [payload, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64");
  return base64UrlEncode(expectedSignature) === signature;
}
