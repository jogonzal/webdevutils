export class Delay {
  public static delay(milliseconds: number): Promise<void> {
    return new Promise(resolve =>
      window.setTimeout(resolve, milliseconds)
    )
  }
}
