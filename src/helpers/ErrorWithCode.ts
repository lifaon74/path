export class ErrorWithCode<T = undefined> extends Error {
  protected readonly _code: T;

  constructor(message: string, code?: T) {
    super(message);
    this._code = code as T;
  }

  get code(): T {
    return this._code;
  }
}
