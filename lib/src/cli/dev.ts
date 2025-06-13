import { Logger } from "../utils";
import nodemon from "nodemon";

nodemon({
  script: "src/main", // Nama file tanpa ekstensi
  ext: "js,ts,json", // Ekstensi file yang dipantau
  ignore: ["node_modules/**", "dist/**"], // Folder yang tidak ingin dipantau
  exec: "node", // Untuk mendukung TypeScript, atau hanya "node" untuk JavaScript
});

nodemon
  .on("start", () => {
    Logger.info("MyD started watching...");
  })
  .on("restart", (files) => {
    Logger.debug(`MyD restarting due to changes in: ${files}`);
  })
  .on("quit", () => {
    Logger.info("MyD exited.");
    process.exit();
  })
  .on("stdout", (msg) => {
    Logger.info(msg);
  })
  .on("stderr", (err) => {
    Logger.error(`MyD encountered an error: ${err}`);
  });
