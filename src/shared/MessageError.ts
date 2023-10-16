export class MessageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MessageError";
  }

  public static isMessageError(error: Error): error is MessageError {
    return (
      error !== undefined &&
      error !== null &&
      (error as MessageError).name === "MessageError"
    );
  }
}
