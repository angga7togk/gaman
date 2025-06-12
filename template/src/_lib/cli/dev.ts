import { Logger } from "_lib/utils";
import nodemon from "nodemon";

nodemon({
  script: "src/main.ts", // Path ke file utama Anda
  ext: "js ts json", // Ekstensi file yang dipantau
  ignore: ["node_modules/**", "dist/**"], // Folder yang tidak ingin dipantau
  exec: "node", // Perintah eksekusi, ganti ke ts-node jika menggunakan TypeScript
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
