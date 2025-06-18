import app from "../src/index";
import mainBlock from "./main.block";
import TesPlugin from "./TesPlugin";

app.serv({
  plugins: [TesPlugin],
  blocks: [mainBlock],
  server: {
    host: "0.0.0.0", // opsional
    port: 3431 // opsional
  }
});
