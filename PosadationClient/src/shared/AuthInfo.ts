import * as Faker from 'faker'
import { Log } from './logging/Log'

export class AuthInfo {
  private static readonly userIdCacheKey = 'LocalUserId'
  public static getUserId(): string {
    let userId = localStorage.getItem(this.userIdCacheKey)
    if (userId) {
      Log.logger.info('Using user from local storage')
      return userId
    }

    Log.logger.info('Creating a new user')
    userId = Faker.name.findName()
    localStorage.setItem(this.userIdCacheKey, userId)
    return userId
  }
}