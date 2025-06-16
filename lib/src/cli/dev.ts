import { Logger } from "../index";
import nodemon from "nodemon";

nodemon({
  script: "src/main", // Nama file tanpa ekstensi
  ext: "js,ts,json", // Ekstensi file yang dipantau
  ignore: ["node_modules/**", "dist/**"], // Folder yang tidak ingin dipantau
  exec: "node", // Untuk mendukung TypeScript, atau hanya "node" untuk JavaScript
});

nodemon
  .on("start", () => {
    Logger.info("Gamman started watching...");
  })
  .on("restart", (files) => {
    Logger.debug(`Gamman restarting due to changes in: ${files}`);
  })
  .on("quit", () => {
    Logger.info("Gamman exited.");
    process.exit();
  })
  .on("stdout", (msg) => {
    Logger.info(msg);
  })
  .on("stderr", (err) => {
    Logger.error(`Gamman encountered an error: ${err}`);
  });
