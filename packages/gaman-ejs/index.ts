/**
 * @package @gaman/ejs
 * GamanJS integration for EJS view rendering.
 */

import { defineIntegration, Priority, Response } from "gaman";
import * as _ejs from "ejs";
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

  /**
   * Priority Integrations
   * @default normal
   */
  priority?: Priority;
}

export default function ejs(ops: GamanEJSOptions = {}) {
  const { viewPath, ...ejsOps } = ops;
  return defineIntegration({
    name: "ejs",
    priority: ops.priority || "normal",
    async onResponse(_app, _ctx, res) {
      const renderData = res.renderData;
      if(renderData == null) return res; // ! next() if renderData null

      const filePath = join(
        process.cwd(),
        viewPath || "src/views",
        `${renderData.getName()}.ejs`
      );
      const rendered = await _ejs.renderFile(filePath, renderData.getData(), ejsOps);
      return Response.html(rendered, { status: 200 });
    },
  });
}
