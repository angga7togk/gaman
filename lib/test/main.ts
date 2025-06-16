import app from "gaman";
import mainBlock from "./main.block";

app.serv({
  blocks: [mainBlock],
  server: {
    host: "0.0.0.0", // opsional
    port: 3431 // opsional
  }
});
