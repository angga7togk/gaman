import chalk from "chalk";

export const Logger = {
  log: (message: any) => Logger.info(message),
  info: (message: any) => console.log(`${chalk.blue("[INFO]")} ${message}`),
  debug: (message: any) => console.log(`${chalk.green("[DEBUG]")} ${message}`),
  error: (message: any) => console.error(`${chalk.red("[ERROR]")} ${message}`),
};
