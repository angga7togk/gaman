import mainBlock from "main.block";
import gaman from "gaman";

gaman.serv({
  blocks: [mainBlock],
  config: {
    server: {
      host: "0.0.0.0",
      port: 3431,
    },
  },
});
