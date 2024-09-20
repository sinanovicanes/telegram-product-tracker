import chalk from "chalk";

enum LogKind {
  LOG = "LOG",
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
  TRACE = "TRACE"
}

export class Logger {
  constructor(private readonly name: string) {}

  private processLog(kind: LogKind, message: string) {
    const name = chalk.bold(chalk.yellowBright(`[${this.name}]`));
    const prefix = `${chalk.white(new Date().toLocaleString())} ${LogKind[kind]} ${name}`;

    message = `${prefix} ${message}`;

    switch (kind) {
      case LogKind.LOG:
        console.log(chalk.green(message));
        break;
      case LogKind.INFO:
        console.info(chalk.blue(message));
        break;
      case LogKind.ERROR:
        console.error(chalk.red(message));
        break;
      case LogKind.WARN:
        console.warn(chalk.yellow(message));
        break;
      case LogKind.DEBUG:
        console.debug(chalk.cyan(message));
        break;
      case LogKind.TRACE:
        console.trace(chalk.magenta(message));
        break;
    }
  }

  log(message: string) {
    this.processLog(LogKind.LOG, message);
  }

  info(message: string) {
    this.processLog(LogKind.INFO, message);
  }

  error(message: string) {
    this.processLog(LogKind.ERROR, message);
  }

  warn(message: string) {
    this.processLog(LogKind.WARN, message);
  }

  debug(message: string) {
    this.processLog(LogKind.DEBUG, message);
  }

  trace(message: string) {
    this.processLog(LogKind.TRACE, message);
  }
}
