// import * as Faker from 'faker'
import { Log } from './logging/Log'

export class AuthInfo {
  private static readonly userIdCacheKey = 'LocalUserId2'
  public static getUserId(): string | undefined {
    const userId = sessionStorage.getItem(this.userIdCacheKey)
    if (userId) {
      Log.logger.info('Using user from local storage')
      return userId
    }

    return undefined
    // userId = Faker.name.firstName()
    // sessionStorage.setItem(this.userIdCacheKey, userId)
    // return userId
  }

  public static setUserId(userId: string) {
    if (!userId) {
      throw new Error('Bad userId')
    }

    sessionStorage.setItem(this.userIdCacheKey, userId)
  }
}
