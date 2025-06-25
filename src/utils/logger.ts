import { Color } from "./color";

export const Logger = {
  level: "debug", // Bisa diatur ke 'info', 'debug', atau 'error'
  response: {
    route: "",
    status: null,
  },

  log: (...message: any[]) => Logger.info(...message),

  info: (...message: any[]) => {
    if (Logger.shouldLog("info")) {
      console.log(
        `${Color.reset}${Color.bg.blue}[INFO]${Color.reset} ${
          Color.fg.gray
        }[${Logger.getShortTime()}]` +
          (Logger.response.status !== null
            ? ` ${Logger.getStatusColor(Logger.response.status)}[${
                Logger.response.status
              }]`
            : "") +
          (Logger.response.route
            ? `[${Logger.response.route}]${Color.reset}`
            : "") +
          `${Color.reset}`,
        ...message
      );
    }
  },

  debug: (...message: any[]) => {
    if (Logger.shouldLog("debug")) {
      console.log(
        `${Color.reset}${Color.bg.orange}[DEBUG]${Color.reset} ${
          Color.fg.orange
        }[${Logger.getShortTime()}]` +
          (Logger.response.status !== null
            ? ` ${Logger.getStatusColor(Logger.response.status)}[${
                Logger.response.status
              }]`
            : "") +
          (Logger.response.route
            ? `[${Logger.response.route}]${Color.reset}`
            : "") +
          `${Color.reset}`,
        ...message
      );
    }
  },

  error: (...message: any[]) => {
    if (Logger.shouldLog("error")) {
      console.error(
        `${Color.reset}${Color.bg.red}[ERROR]${Color.reset} ${
          Color.fg.red
        }[${Logger.getShortTime()}]` +
          (Logger.response.status !== null
            ? ` ${Logger.getStatusColor(Logger.response.status)}[${
                Logger.response.status
              }]`
            : "") +
          (Logger.response.route
            ? `[${Logger.response.route}]${Color.reset}`
            : "") +
          `${Color.reset}`,
        ...message
      );
    }
  },

  getStatusColor: (status: number) => {
    if (status >= 200 && status < 300) return `${Color.fg.green}`;
    if (status >= 300 && status < 400) return `${Color.fg.yellow}`;
    if (status >= 400 && status < 500) return `${Color.fg.red}`;
    if (status >= 500) return `${Color.fg.magenta}`;
    return `${Color.fg.gray}`; // Default untuk status tidak dikenal
  },

  shouldLog: (level: "info" | "debug" | "error") => {
    const levels: { [level: string]: number } = { info: 1, debug: 2, error: 0 };
    return levels[level]! <= levels[Logger.level]!;
  },

  setRoute: (route: string) => {
    Logger.response.route = route;
  },

  setStatus: (status: number | null) => {
    
    Logger.response.status = status as any;
  },

  getShortTime: () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0]; // Format waktu HH:MM:SS
  },
};

export const Log = Logger;
