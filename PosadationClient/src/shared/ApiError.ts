export interface IRestApiError {
  ErrorMessage: string
  ExceptionType: string
  FullErrorMessage: string
  ErrorCode: string | undefined
  InternalErrorMessage: string | undefined
}

export interface IODataError {
  message: string
  code: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  innererror: any
}

export class ApiError extends Error {
  public readonly statusCode: number
  public readonly body: string
  public readonly restApiError: IRestApiError | undefined
  public readonly oDataError: IODataError | undefined
  public readonly requestDescription: string
  constructor(requestDescription: string, statusCode: number, body: string, message: string) {
    super(message)
    this.statusCode = statusCode
    this.body = body
    this.requestDescription = requestDescription
    this.name = 'ApiError'
    if (body) {
      try {
        const json = JSON.parse(body)
        if (json.ErrorMessage && json.ExceptionType) {
          this.restApiError = json
        } else if (json.error && json.error.message) {
          this.oDataError = json.error
        }
      } catch (_error: unknown) {
        return
      }
    }
  }

  public static isApiError(error: Error): error is ApiError {
    return !!(error as ApiError).statusCode
  }
}
