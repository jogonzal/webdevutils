import { NumberUtils } from "../src/shared/utils/NumberUtils";

test("Serialize a simple number", () => {
  const printerNumber = NumberUtils.printNumberAsString(123, undefined);
  expect(printerNumber).toBe("123");
  const parsedNumber = NumberUtils.getStringAsNumber("123");
  expect(parsedNumber).toBe(123);
});

test("Serialize a number with deicmals", () => {
  const printerNumber = NumberUtils.printNumberAsString(10.12, undefined);
  expect(printerNumber).toBe("10.12");
  const parsedNumber = NumberUtils.getStringAsNumber("10.12");
  expect(parsedNumber).toBe(10.12);
});

test("Serialize a number with decimals and minDecimals bigger", () => {
  const printerNumber = NumberUtils.printNumberAsString(10.12, 4);
  expect(printerNumber).toBe("10.1200");
  const parsedNumber = NumberUtils.getStringAsNumber("10.1200");
  expect(parsedNumber).toBe(10.12);
});

test("Serialize a big number with decimals and minDecimals bigger", () => {
  const printerNumber = NumberUtils.printNumberAsString(1000.12, 4);
  expect(printerNumber).toBe("1,000.1200");
  const parsedNumber = NumberUtils.getStringAsNumber("1,000.1200");
  expect(parsedNumber).toBe(1000.12);
});

test("Print number with more decimals to less decimals", () => {
  const printerNumber = NumberUtils.printNumberAsString(1000.123456789, 2);
  expect(printerNumber).toBe("1,000.12");
  const parsedNumber = NumberUtils.getStringAsNumber("1,000.12");
  expect(parsedNumber).toBe(1000.12);
});

test("Serialize a really big number without decimals with min decimals", () => {
  const printerNumber = NumberUtils.printNumberAsString(123456789, 4);
  expect(printerNumber).toBe("123,456,789.0000");
  const parsedNumber = NumberUtils.getStringAsNumber("123,456,789.0000");
  expect(parsedNumber).toBe(123456789);
});

test("Serialize a really big number without decimals with min decimals", () => {
  const printerNumber = NumberUtils.printNumberAsString(123456789, undefined);
  expect(printerNumber).toBe("123456789");
  const parsedNumber = NumberUtils.getStringAsNumber("123456789");
  expect(parsedNumber).toBe(123456789);
});

test("Serialize invalid number with /", () => {
  const parsedNumber = NumberUtils.getStringAsNumber("1 1/3");
  expect(parsedNumber).toBeUndefined();
});

test("We ignore spaces", () => {
  const parsedNumber = NumberUtils.getStringAsNumber("1 13");
  expect(parsedNumber).toBe(113);
});
