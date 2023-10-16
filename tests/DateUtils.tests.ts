import { DateUtils } from "../src/shared/utils/DateUtils";

test("Serialize the date es-mx", () => {
  const date = DateUtils.parse("20/12/2019", "es-mx");
  if (!date) {
    throw new Error("date is undefined");
  }
  const dateAsStr = DateUtils.serializeToString(date);
  expect(dateAsStr).toBe("2019-12-20");
});

test("Serialize the date en-us", () => {
  const date = DateUtils.parse("01/20/2019", "en-us");
  if (!date) {
    throw new Error("date is undefined");
  }
  const dateAsStr = DateUtils.serializeToString(date);
  expect(dateAsStr).toBe("2019-01-20");
});

test("Serialize/deserialize date with timezone", () => {
  const date = DateUtils.deserializeDate("2020-01-22T07:19:18.733Z");
  const dateAsStr = DateUtils.serializeToString(date);
  expect(dateAsStr).toBe("2020-01-22");
});

test("Serialize/deserialize date without timezone", () => {
  const date = DateUtils.deserializeDate("2020-01-22");
  const dateAsStr = DateUtils.serializeToString(date);
  expect(dateAsStr).toBe("2020-01-22");
});
