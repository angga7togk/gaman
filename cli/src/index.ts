#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .scriptName("gaman")
  .usage("$0 <cmd> [args]")
  .command(
    "new",
    "Create a new application template.",
    () => {},
    async () => {
      await import("./commands/new.js");
    }
  )
  .command(
    "dev",
    "Run the application in development mode.",
    (yargs) => {
      yargs
        .option("endpoint", {
          alias: "e",
          type: "string",
          default: "src/main",
          describe: "The entry point file to watch and execute.",
        })
        .option("ext", {
          alias: "x",
          type: "string",
          default: "js,ts,json",
          describe: "File extensions to watch for changes.",
        })
        .option("ignore", {
          alias: "i",
          type: "array",
          default: ["node_modules/**", "dist/**"],
          describe: "Files or directories to ignore.",
        })
        .option("exec", {
          alias: "c",
          type: "string",
          default: "node",
          describe: "Command to execute (e.g., 'node' or 'bun').",
        });
    },
    async (argv) => {
      const { default: devCommand } = await import("./commands/dev.js");
      devCommand({
        endpoint: argv.endpoint as any,
        ext: argv.ext as any,
        ignore: argv.ignore as any,
        exec: argv.exec as any,
      });
    }
  )
  .command(
    "upgrade",
    "Upgrade version @gaman/cli",
    () => {},
    async() => {
      await import("./commands/upgrade.js")
    }
  )
  .demandCommand(1, "You need at least one command before moving on")
  .help().argv;
