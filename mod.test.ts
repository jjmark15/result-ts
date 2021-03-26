import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.91.0/testing/asserts.ts";
import Result, { IllegalResultAccessError } from "./mod.ts";

const VALUE = "value";
const DEFAULT_VALUE = "default value";
const ERROR = new Error();
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
    IllegalResultAccessError,
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

Deno.test("throwIfErr throws if there is an error", () => {
  assertThrows(() => ERR.throwIfErr(), Error);
});

Deno.test("throwIfErr does nothing if there is no error", () => {
  OK.throwIfErr();
});
