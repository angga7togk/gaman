import { Context, GamanPlugin, Logger, PluginPriority } from "../src/index";

export default class TesPlugin extends GamanPlugin {
  public name: string = "TesPlugin";
  public version: string = "1.0.0";
  public priority: PluginPriority = "normal";
  public description?: string | undefined;
  public website?: string | undefined;
  public author?: string | undefined;
  public authors?: string[] | undefined;

  public onStart() {
    Logger.log("ON Start");
  }

  public onRequest(ctx: Context) {
    Logger.log("aduah")
  }

}
