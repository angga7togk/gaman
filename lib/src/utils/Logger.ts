const Logger = {
  level: "debug", // Bisa diatur ke 'info', 'debug', atau 'error'

  log: (message: any) => Logger.info(message),
  info: (message: any) => {
    if (Logger.shouldLog("info")) {
      console.log(
        `\x1b[34m[INFO]\x1b[0m \x1b[90m[${new Date().toLocaleTimeString()}]\x1b[0m ${message}`
      );
    }
  },
  debug: (message: any) => {
    if (Logger.shouldLog("debug")) {
      console.log(
        `\x1b[32m[DEBUG]\x1b[0m \x1b[90m[${new Date().toLocaleTimeString()}]\x1b[0m ${message}`
      );
    }
  },
  error: (message: any) => {
    if (Logger.shouldLog("error")) {
      console.error(
        `\x1b[31m[ERROR]\x1b[0m \x1b[90m[${new Date().toLocaleTimeString()}]\x1b[0m ${message}`
      );
    }
  },
  shouldLog: (level: "info" | "debug" | "error") => {
    const levels: { [level: string]: number } = { info: 1, debug: 2, error: 0 };
    return levels[level]! <= levels[Logger.level]!;
  },
};

export default Logger;
