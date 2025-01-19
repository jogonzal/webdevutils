import { IPrimitiveProperties } from "./LoggingActivity";

export class ConsoleLogger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  error(message: string): void {
    console.error(`[${this.namespace}] [Error] ${message}`);
  }

  info(message: string): void {
    console.log(`[${this.namespace}] [Info] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[${this.namespace}] [Warn] ${message}`);
  }

  logReportData(eventName: string, payload?: IPrimitiveProperties): void {
    const message = (payload ? payload.Message : "") ?? "";
    console.info(
      `[${this.namespace}] [${eventName}] ${message}`,
      payload ?? "",
    );
  }
}
