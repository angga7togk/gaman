/**
 * @package @gaman/ejs
 * GamanJS integration for EJS view rendering.
 */

import { defineIntegration, Response } from "gaman";
import * as ejs from "ejs";
import { type Options } from "ejs";
import { join } from "path";

/**
 * EJS rendering options.
 * These options are passed directly to the EJS renderer.
 * You can find the full list of supported options at:
 * @url https://github.com/mde/ejs?tab=readme-ov-file#options
 */
export interface GamanEJSOptions extends Options {
  /**
   * Directory path for views.
   * This specifies the root directory where your EJS templates are located.
   * Default: `src/views`.
   */
  viewPath?: string;
}

export default function gamanEJS(ops: GamanEJSOptions = {}) {
  const { viewPath, ...ejsOps } = ops;
  return defineIntegration({
    name: "ejs",
    priority: "normal",
    async onRender(_app, _ctx, res) {
      const filePath = join(
        process.cwd(),
        viewPath || "src/views",
        `${res.viewName}.ejs`
      );
      const rendered = await ejs.renderFile(filePath, res.viewData, ejsOps);
      return Response.html(rendered, { status: 200 });
    },
  });
}
