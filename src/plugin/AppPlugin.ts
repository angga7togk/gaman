import { GamanPlugin } from "./plugin";

export class AppPlugin {
  private plugins: Array<GamanPlugin> = [];

  public register(plugin: GamanPlugin) {
    // Insert the plugin into the plugins array based on its priority
    switch (plugin.priority) {
      case "high":
        this.plugins.unshift(plugin); // Add to the beginning of the array
        break;
      case "low":
        this.plugins.push(plugin); // Add to the end of the array
        break;
      case "normal":
      default:
        // Find the first non-high-priority plugin and insert before it
        const normalIndex = this.plugins.findIndex(
          (p) => p.priority !== "high"
        );
        if (normalIndex === -1) {
          this.plugins.push(plugin); // Add to the end if all are high priority
        } else {
          this.plugins.splice(normalIndex, 0, plugin); // Insert at the normal position
        }
    }
  }

  public getPlugins(): GamanPlugin[] {
    return this.plugins;
  }
}
