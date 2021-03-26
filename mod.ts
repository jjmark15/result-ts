import {
  okOr,
  unwrapOr,
} from "https://raw.githubusercontent.com/jjmark15/optional-utils-ts/v0.2.0/mod.ts";

enum IllegalResultAccessSubject {
  Value = "value",
  Error = "error",
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

  private constructor(value?: T, error?: E) {
    this._value = value;
    this._error = error;
  }

  public static ok<T, E extends Error>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined);
  }

  public static err<T, E extends Error>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error);
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
    if (this.isOk()) {
      return unwrapOr(this._value, defaultValue);
    } else {
      return defaultValue;
    }
  }

  public unwrapOrElse(f: () => T): T {
    if (this.isOk()) {
      return okOr(
        this._value,
        new Error(
          "Internal Result error: value is undefined when Result is ok",
        ),
      );
    } else {
      return f();
    }
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
}
