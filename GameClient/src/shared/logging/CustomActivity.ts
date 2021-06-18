import { getErrorAsString } from './getErrorAsString'
import { Log } from './Log'

export class CustomActivity {
  private start: number
  private activityName: string
  private primitiveProperties: IPrimitiveProperties
  private activityIsFinished: boolean
  private eventName: string = 'Activity'

  constructor(activityName: string) {
    this.start = Date.now()
    this.activityName = activityName
    this.primitiveProperties = {}
    this.activityIsFinished = false
  }

  private markActivityFinishedAndWarnIfAlreadyFinished(): void {
    if (this.activityIsFinished) {
      Log.logger.error(`The activity ${this.activityName} was somehow finished twice - this should never happen!`)
    }
    this.activityIsFinished = true
  }

  public finishWithSuccess(): void {
    this.markActivityFinishedAndWarnIfAlreadyFinished()
    Log.logger.logReportData(this.eventName, {
      ...this.primitiveProperties,
      'Success': true,
      'SuccessRate': 1,
      'Duration': Date.now() - this.start,
      'ActivityName': this.activityName,
      'Message': `Activity ${this.activityName} succeeded`,
    })
  }

  public finishWithFailure(errorBucket: string, error?: Error): void {
    this.markActivityFinishedAndWarnIfAlreadyFinished()
    let errorMessage = errorBucket
    if (error) {
      errorMessage = getErrorAsString(error)
    }
    Log.logger.logReportData(this.eventName, {
      ...this.primitiveProperties,
      'Success': false,
      'SuccessRate': 0,
      'ErrorName': error ? error.name : '',
      'Duration': Date.now() - this.start,
      'ErrorMessage': errorMessage,
      'ErrorBucket': errorBucket,
      'ActivityName': this.activityName,
      'Message': `Activity ${this.activityName} failed`,
    })
  }

  public addProperty(key: string, value: string | number | boolean): void {
    this.primitiveProperties[key] = value
  }
}

export interface IPrimitiveProperties {
  [key: string]: string | number | boolean
}
