import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.91.0/testing/asserts.ts";
import {
  Result,
  catchInResult,
  IllegalResultAccessError,
  ResultType,
} from "./mod.ts";

const VALUE = "value";
const DEFAULT_VALUE = "default value";
const ERROR_MESSAGE = "error message";
const ERROR = new Error(ERROR_MESSAGE);
const OK = Result.ok(VALUE);
const ERR = Result.err(ERROR);

Deno.test("result is ok when the result is not an error", () => {
  assert(OK.isOk());
});

Deno.test("result is not ok when the result is an error", () => {
  assert(!ERR.isOk());
});

Deno.test("result is err when the result is an error", () => {
  assert(ERR.isErr());
});

Deno.test("result is not err when the result is not an error", () => {
  assert(!OK.isErr());
});

Deno.test("unwrap returns value when the Result is ok", () => {
  assertEquals(OK.unwrap(), VALUE);
});

Deno.test("unwrap throws when the Result is err", () => {
  assertThrows(
    () => ERR.unwrap(),
    Error,
    undefined,
    "Attempted to access result value but it does not exist",
  );
});

Deno.test("unwrapOr returns value when the Result is ok", () => {
  assertEquals(OK.unwrapOr(DEFAULT_VALUE), VALUE);
});

Deno.test("unwrapOr returns default value when the Result is not ok", () => {
  assertEquals(ERR.unwrapOr(DEFAULT_VALUE), DEFAULT_VALUE);
});

Deno.test("unwrapOrElse returns value when the Result is ok", () => {
  assertEquals(OK.unwrapOrElse(() => DEFAULT_VALUE), VALUE);
});

Deno.test("unwrapOrElse returns default value when the Result is not ok", () => {
  assertEquals(ERR.unwrapOrElse(() => DEFAULT_VALUE), DEFAULT_VALUE);
});

Deno.test("unwrapErr returns error when the Result is err", () => {
  assertEquals(ERR.unwrapErr(), ERROR);
});

Deno.test("unwrapErr throws when the Result is ok", () => {
  assertThrows(
    () => OK.unwrapErr(),
    IllegalResultAccessError,
    undefined,
    "Attempted to access result error but it does not exist",
  );
});

Deno.test("wraps thrown errors in a Result", () => {
  const result = catchInResult(() => {
    throw ERROR;
  });

  assertEquals(result.unwrapErr().message, ERROR_MESSAGE);
});

Deno.test("wraps returned values in a Result", () => {
  const result = catchInResult(() => VALUE);

  assertEquals(result.unwrap(), VALUE);
});

Deno.test("returns Ok result state when ok", () => {
  assertEquals(OK.state(), ResultType.Ok);
});

Deno.test("returns Err result state when err", () => {
  assertEquals(ERR.state(), ResultType.Err);
});
