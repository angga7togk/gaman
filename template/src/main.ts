import mainBlock from "main.block";
import App from "myd";

const app = App({
  blocks: [mainBlock],
  config: {
    server: {
      host: '0.0.0.0',
      port: 3431
    }
  }
});

export default app;
