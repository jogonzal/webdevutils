import { default as PromisePool } from 'es6-promise-pool'

export class PromiseUtils {
  public static async runConcurrently<T>(promiseArray: (() => Promise<T>)[], concurrency: number = 5): Promise<T[]> {
    let count = 0
    const results: Promise<T>[] = []
    const promiseGenerator: () => Promise<T> | void = () => {
      if (count >= promiseArray.length) {
        return
      }

      const promise = promiseArray[count]()
      results[count] = promise
      count = count + 1
      return promise
    }
    const pool = new PromisePool(promiseGenerator, concurrency)

    await pool.start() // This is where the concurrent running happens

    return Promise.all(results)
  }
}
