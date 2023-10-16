export class NumberUtils {
  public static getStringAsNumber(str: string): number | undefined {
    if (str === undefined || str === null || str === "") {
      return undefined;
    }

    if (str.indexOf("/") !== -1) {
      return undefined;
    }

    // Remove commas, spaces
    str = str.replace(/,/g, "").replace(/ /g, "");
    const numVal = parseFloat(str);
    if (isNaN(numVal)) {
      return undefined;
    }

    return numVal;
  }

  public static printNumberAsString(
    val: number,
    decimals: number | undefined
  ): string {
    // Protect against NaN
    if (isNaN(val)) {
      val = 0;
    }

    if (decimals === undefined) {
      return val.toString();
    }

    // Truncate
    val = NumberUtils.round(val, decimals);

    const parts = val.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (decimals !== undefined && decimals > 0) {
      if (parts[1] === undefined) {
        parts[1] = "0";
      }
      const decimalsMissing = decimals - parts[1].length;
      let i = 0;
      for (i = 0; i < decimalsMissing; i += 1) {
        parts[1] = parts[1] + "0";
      }
    }
    return parts.join(".");
  }

  public static round(num: number, decimals: number): number {
    return Number(num.toFixed(decimals));
  }
}
