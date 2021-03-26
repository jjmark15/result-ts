enum IllegalResultAccessSubject {
  Value = "value",
  Error = "error",
}

export enum ResultState {
  Ok,
  Err,
}

export function catchInResult<T, E extends Error>(f: () => T): Result<T, E> {
  try {
    return Result.ok(f());
  } catch (error) {
    return Result.err(error);
  }
}

export class IllegalResultAccessError extends Error {
  constructor(accessSubject: IllegalResultAccessSubject) {
    super(IllegalResultAccessError.errorMessage(accessSubject));
  }

  private static errorMessage(
    accessSubject: IllegalResultAccessSubject,
  ): string {
    return "Attempted to access result " + accessSubject +
      " but it does not exist";
  }
}

export default class Result<T, E extends Error> {
  private readonly _value?: T;
  private readonly _error?: E;
  private readonly _resultState: ResultState;

  private constructor(resultState: ResultState, value?: T, error?: E) {
    this._value = value;
    this._error = error;
    this._resultState = resultState;
  }

  public static ok<T, E extends Error>(value: T): Result<T, E> {
    return new Result<T, E>(ResultState.Ok, value, undefined);
  }

  public static err<T, E extends Error>(error: E): Result<T, E> {
    return new Result<T, E>(ResultState.Err, undefined, error);
  }

  public isOk(): boolean {
    return this._error === undefined;
  }

  public isErr(): boolean {
    return !this.isOk();
  }

  public unwrap(): T | never {
    if (this._value !== undefined) {
      return this._value;
    } else {
      throw new IllegalResultAccessError(IllegalResultAccessSubject.Value);
    }
  }

  public unwrapOr(defaultValue: T): T {
    return this.isOk() ? this.unwrap() : defaultValue;
  }

  public unwrapOrElse(f: () => T): T {
    return this.isOk() ? this.unwrap() : f();
  }

  public unwrapErr(): Error | never {
    if (this._error !== undefined) {
      return this._error;
    } else {
      throw new IllegalResultAccessError(IllegalResultAccessSubject.Error);
    }
  }

  public throwIfErr(): void | never {
    if (this._error !== undefined) {
      throw this._error;
    }
  }

  public state(): ResultState {
    return this._resultState;
  }
}
