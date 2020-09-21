// import * as Faker from 'faker'
import { Log } from './logging/Log'

export class AuthInfo {
  private static readonly userIdCacheKey = 'LocalUserId'
  public static getUserId(): string {
    const userId = localStorage.getItem(this.userIdCacheKey)
    if (userId) {
      Log.logger.info('Using user from local storage')
      return userId
    }

    Log.logger.info('No user!')
    throw new Error('No user!')
    // userId = Faker.name.firstName()
    // localStorage.setItem(this.userIdCacheKey, userId)
    // return userId
  }

  public static setUserId(userId: string) {
    if (!userId) {
      throw new Error('Bad userId')
    }

    localStorage.setItem(this.userIdCacheKey, userId)
  }
}