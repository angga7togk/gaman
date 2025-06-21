import { Color } from "./color";

export const Logger = {
  level: "debug", // Bisa diatur ke 'info', 'debug', atau 'error'
  route: "", // Default route

  log: (message: any) => Logger.info(message),

  info: (message: any) => {
    if (Logger.shouldLog("info")) {
      console.log(
        `${Color.reset}${Color.bg.blue}[INFO]${Color.reset} ${Color.fg.gray}[${Logger.getShortTime()}]${Color.reset}` +
        `${Logger.route ? ` ${Color.fg.green}[${Logger.route}] ` : " "}` +
        `${Color.reset}${message}${Color.reset}`
      );
    }
  },

  debug: (message: any) => {
    if (Logger.shouldLog("debug")) {
      console.log(
        `${Color.reset}${Color.bg.orange}[DEBUG]${Color.reset} ${Color.fg.orange}[${Logger.getShortTime()}]` +
        `${Logger.route ? ` ${Color.fg.orange}[${Logger.route}] ` : " "}` +
        `${message}${Color.reset}`
      );
    }
  },

  error: (message: any) => {
    if (Logger.shouldLog("error")) {
      console.error(
        `${Color.reset}${Color.bg.red}[ERROR]${Color.reset} ${Color.fg.red}[${Logger.getShortTime()}]` +
        `${Logger.route ? ` ${Color.fg.red}[${Logger.route}] ` : " "}` +
        `${message}${Color.reset}`
      );
    }
  },

  shouldLog: (level: "info" | "debug" | "error") => {
    const levels: { [level: string]: number } = { info: 1, debug: 2, error: 0 };
    return levels[level]! <= levels[Logger.level]!;
  },

  setRoute: (route: string) => {
    Logger.route = route;
  },

  getShortTime: () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0]; // Format waktu HH:MM:SS
  },
};

export const Log = Logger;
