export async function sleep(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * @param fn function that examines if condition is mer (must return boolean)
 * @param timeout
 * @param delay
 * @param condition texttual description of the condition
 */
export async function wait(
  fn: (...args) => Promise<boolean>,
  timeout: number = 30000,
  delay: number = 200,
  condition = ''
): Promise<any> {
  const startTime = Number(new Date())
  const endTime: number = startTime + timeout

  const test = function (resolve, reject) {
    const result: Promise<boolean> = fn()

    result
      .then((res) => {
        if (res) {
          console.log(`SUCCESS: condition met after ${Number(new Date()) - startTime} ms! ${condition}`)
          resolve(res)
        } else if (Number(new Date()) < endTime) setTimeout(test, delay, resolve, reject)
        else
          reject(
            new Error(
              `Wait: timed out after ${timeout}. Failed to validate: ${
                condition ? condition : 'condition description not provided'
              }`
            )
          )
      })
      .catch((err) => {
        if (Number(new Date()) < endTime) setTimeout(test, delay, resolve, reject)
        else
          reject(
            new Error(
              `Wait: timed out after ${timeout}. Failed to validate ${
                condition ? condition : 'condition description not provided'
              }\nError: ${err}`
            )
          )
      })
  }

  return new Promise(test)
}
