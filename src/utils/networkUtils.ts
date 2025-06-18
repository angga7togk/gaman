import os from "os";

export function getNetworkAddress(
  host: string | undefined,
  port: number
):
  | {
      host: string;
      port: number;
    }
  | undefined {
  if (host === "0.0.0.0" || host === "::") {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
      if (!iface) continue;

      for (const details of iface) {
        const isIPv4 = details.family === "IPv4";
        const isIPv6 = details.family === "IPv6";

        if (
          (host === "0.0.0.0" && isIPv4 && !details.internal) ||
          (host === "::" && isIPv6 && !details.internal)
        ) {
          return {
            host: details.address,
            port,
          };
        }
      }
    }
  }

  // Default to localhost
  return undefined;
}
