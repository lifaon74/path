/**
 * Compares 'a' and 'b'
 */
export function eq(a: any, b: any): boolean {
  return Object.is(a, b)
    || (JSON.stringify(a) === JSON.stringify(b));
}

/**
 * Returns a promise resolved with true if calling 'cb' throws, else the promise is resolved with false
 */
export function fails(cb: () => any | Promise<any>): Promise<boolean> {
  return new Promise<boolean>(resolve => resolve(cb()))
    .then(() => false, () => true);
}


/**
 * Returns a promise rejected with an 'Assert' error if calling 'cb' throws, or 'cb' returns false
 * @Example:
 *  await assert(() => [1, 2].length === 2);  // => wont throw
 *  await assert(() => [1, 2].length === 3);  // => will throw
 */
export function assert(cb: () => boolean | Promise<boolean>, message: string = cb.toString()): Promise<void> {
  return new Promise<boolean>(resolve => resolve(cb()))
    .then((result: boolean) => {
      if (!result) {
        throw new Error(`Assert failed: ${ message }`);
      }
    }, (error: any) => {
      throw new Error(`Assert failed - ${ error.message } -: ${ message }`);
    });
}

/**
 * Returns a promise rejected if calling 'cb' doesn't throw
 */
export function assertFails(cb: () => any | Promise<any>, message: string = cb.toString()): Promise<void> {
  return assert(() => fails(cb), `expected to fail - ${ message }`);
}


export function failsSync(cb: () => void): boolean {
  try {
    cb();
    return false;
  } catch (e) {
    return true;
  }
}

export function assertFailsSync(cb: () => void): void {
  if (!failsSync(cb)) {
    console.log(cb.toString());
    throw new Error(`Expected to fail`);
  }
}
