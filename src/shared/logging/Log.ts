import { ConsoleLogger } from "./ConsoleLogger";
import { IPrimitiveProperties } from "./LoggingActivity";

export class TelemetryLogger {
  private consoleLogger: ConsoleLogger;

  constructor(namespace: string) {
    this.consoleLogger = new ConsoleLogger(namespace);
  }

  error(message: string): void {
    this.consoleLogger.error(message);
  }

  info(message: string): void {
    this.consoleLogger.info(message);
  }

  warn(message: string): void {
    this.consoleLogger.warn(message);
  }

  logReportData(eventName: string, payload?: IPrimitiveProperties): void {
    this.consoleLogger.logReportData(eventName, payload);
  }

  configureTelemetry(): void {}
}

export class Log {
  private static telemetryLogger: TelemetryLogger = new TelemetryLogger(
    "WebDevUtils"
  );

  static get logger(): TelemetryLogger {
    return this.telemetryLogger;
  }
}
