import { ApplicationInsights } from '@microsoft/applicationinsights-web'

import { ConsoleLogger } from './ConsoleLogger'
import { IPrimitiveProperties } from './CustomActivity'

export class TelemetryLogger {
  private consoleLogger: ConsoleLogger
  public insights: ApplicationInsights | undefined

  constructor(namespace: string) {
    this.consoleLogger = new ConsoleLogger(namespace)
  }

  error(message: string): void {
    this.consoleLogger.error(message)
    if (this.insights) {
      this.insights.trackTrace({
        message: `[ERROR] ${message}`,
      })
    }
  }

  info(message: string): void {
    this.consoleLogger.info(message)
    if (this.insights) {
      this.insights.trackTrace({
        message: `[INFO] ${message}`,
      })
    }
  }

  warn(message: string): void {
    this.consoleLogger.warn(message)
    if (this.insights) {
      this.insights.trackTrace({
        message: `[WARN] ${message}`,
      })
    }
  }

  logReportData(eventName: string, payload?: IPrimitiveProperties): void {
    this.consoleLogger.logReportData(eventName, payload)
    if (this.insights) {
      this.insights.trackEvent({
        name: eventName,
      },
      payload)
    }
  }

  configureTelemetry(insights: ApplicationInsights): void {
    this.insights = insights
  }
}

export class Log {
  private static telemetryLogger: TelemetryLogger = new TelemetryLogger('Posadation')

  static get logger(): TelemetryLogger {
    return this.telemetryLogger
  }
}
