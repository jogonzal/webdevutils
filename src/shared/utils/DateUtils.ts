import { getErrorAsString } from "../logging/getErrorAsString";
import { Log } from "../logging/Log";

export class DateUtils {
  public static serializeToString(date: Date): string {
    return `${this.formatWith0(date.getFullYear(), 4)}-${this.formatWith0(
      date.getMonth() + 1,
      2
    )}-${this.formatWith0(date.getDate(), 2)}`;
    // if (dateAsString.endsWith('Z')) {
    //   return dateAsString.substring(0, dateAsString.length - 2)
    // }
    // return dateAsString
  }

  private static formatWith0(n: number, digits: number): string {
    return ("0" + n).slice(-2 - digits + 2);
  }

  public static deserializeDate(dateStr: string): Date {
    const tPosition = dateStr.indexOf("T");
    if (tPosition !== -1) {
      dateStr = dateStr.substring(0, tPosition);
    }

    try {
      const date = new Date(dateStr);
      if (isNaN(date as any)) {
        throw new Error(`Date ${dateStr} is invalid!`);
      }
      return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
      // Log.logger.info(`Deserialized date ${dateStr} into ${newDate}`)
    } catch (error: unknown) {
      Log.logger.error(
        `Error when deserializing date ${getErrorAsString(error)}`
      );
      throw error;
    }
  }

  public static parse(dateStr: string, locale: string): Date | undefined {
    const date = DateUtils.parsePrivate(dateStr, locale);
    if (!date) {
      return undefined;
    }

    return date;
  }

  public static prettyPrintDate(date: Date, locale: string): string {
    locale = locale.toLowerCase();
    if (locale === "es-mx") {
      return `${this.formatWith0(date.getDate(), 2)}/${this.formatWith0(
        date.getMonth() + 1,
        2
      )}/${this.formatWith0(date.getFullYear(), 4)}`;
    }

    return `${this.formatWith0(date.getMonth() + 1, 2)}/${this.formatWith0(
      date.getDate(),
      2
    )}/${this.formatWith0(date.getFullYear(), 4)}`;
  }

  static parsePrivate(dateStr: string, locale: string): Date | undefined {
    try {
      locale = locale.toLowerCase();
      if (locale === "es-mx") {
        const arr = dateStr.split("/");
        if (arr.length === 3) {
          const year = parseInt(arr[2], 10);
          const month = parseInt(arr[1], 10) - 1;
          const day = parseInt(arr[0], 10);
          return new Date(year, month, day);
          // Log.logger.info(`Transformed date ${dateStr} into ${date}`)
        }
      }

      return new Date(dateStr);
    } catch (error: unknown) {
      Log.logger.warn(`Failed to parse date ${getErrorAsString(error)}`);
      return undefined;
    }
  }

  public static getTodaysSerializableDate(): string {
    return this.serializeToString(new Date());
  }
}
