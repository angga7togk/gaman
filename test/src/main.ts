import contentBlock from "./content/content.block";
import userBlock from "./user/user.block";
import gaman from "gaman";
import mainBlock from "main.block";

gaman.serv({
  strict: true,
  blocks: [mainBlock, userBlock, contentBlock],
});
