export type MydConfig = {
  server?: {
    host?: string;
    port?: number;
  };
};

export function defineConfig(config: MydConfig): MydConfig {
  return config;
}
