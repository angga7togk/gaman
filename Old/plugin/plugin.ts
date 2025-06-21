import { App } from "../app";
import { RequestError } from "../router/error";
import { Response } from "../router/response";
import { Context } from "../router/router";

export type PluginPriority = "normal" | "high" | "low";

export interface PluginInfo {
  name: string;
  version: string;
  priority: PluginPriority;
  description?: string;
  website?: string;
  author?: string;
  authors?: string[];
}

export abstract class GamanPlugin {
  public abstract name: string;
  public abstract version: string;
  public abstract priority: PluginPriority;
  public abstract description?: string;
  public abstract website?: string;
  public abstract author?: string;
  public abstract authors?: string[];

  constructor(private app: App) {}

  public getApp(): App {
    return this.app;
  }
  public onStart(): any {}
  public onRequest(ctx: Context): any {}
  public onClose(): any {}
}
