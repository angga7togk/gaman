import contentBlock from "./content/content.block";
import userBlock from "./user/user.block";
import gaman from "gaman";
import mainBlock from "main.block";

gaman.serv({
  blocks: [mainBlock, userBlock, contentBlock],
  server: {
    port: 3030
  }
});
