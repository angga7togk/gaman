/**
 * @package @gaman/nunjucks
 * GamanJS integration for Nunjucks view rendering.
 */

import { defineIntegration, Priority, Response } from "gaman";
import njk from "nunjucks";
import { join } from "path";

/**
 * Nunjucks rendering options.
 * These options are passed directly to the Nunjucks renderer.
 * You can find the full list of supported options at:
 * @url https://mozilla.github.io/nunjucks/api.html#configure
 */
export interface GamanNunjucksOptions extends Omit<njk.ConfigureOptions, "express"> {
  /**
   * Directory path for views.
   * This specifies the root directory where your Nunjucks templates are located.
   * Default: `src/views`.
   */
  viewPath?: string;

  /**
   * Priority Integrations
   * @default normal
   */
  priority?: Priority;
}

export default function nunjucks(ops: GamanNunjucksOptions = {}) {
  const { viewPath = "src/views", ...njkOps } = ops;

  // Init Nunjucks Environment
  const env = njk.configure(join(process.cwd(), viewPath), njkOps);

  return defineIntegration({
    name: "nunjucks",
    priority: ops.priority || "normal",
    async onResponse(_app, _ctx, res) {
      const renderData = res.renderData;
      if (renderData == null) return res; // ! next() if renderData null

      return new Promise((resolve, reject) => {
        env.render(`${renderData.getName()}.njk`, renderData.getData(), (err, html) => {
          if (err) return reject(err);
          resolve(Response.html(html || "", { status: 200 }));
        });
      });
    },
  });
}
