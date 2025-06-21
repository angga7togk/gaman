import { EventEmitter } from "node:events";
import { AppConfig } from "../types";

class GamanEvent<A extends AppConfig = AppConfig> extends EventEmitter {

}
