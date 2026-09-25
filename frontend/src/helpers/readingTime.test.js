import readingTime from "./readingTime";

// REQ-053: reading time is derived from word count at 200 words/minute,
// rounded up, with a minimum of 1 minute; empty/whitespace/null/undefined
// bodies never produce NaN, 0, or a crash.
describe("readingTime", () => {
  const longBody = `${"word ".repeat(10000)}`;

  test.each([
    ["empty string", "", 1],
    ["whitespace-only", "   \n\t  ", 1],
    ["1 word", "word", 1],
    ["exactly 200 words", "word ".repeat(200).trim(), 1],
    ["201 words", "word ".repeat(201).trim(), 2],
    ["a very long body (10000 words)", longBody, 50],
    ["null", null, 1],
    ["undefined", undefined, 1],
  ])("%s -> %p min", (_description, body, expectedMinutes) => {
    expect(readingTime(body)).toBe(expectedMinutes);
  });

  test("never returns NaN, 0, or a negative number for any of the above", () => {
    for (const body of ["", "   ", null, undefined, "word", "word ".repeat(500)]) {
      const minutes = readingTime(body);

      expect(Number.isNaN(minutes)).toBe(false);
      expect(minutes).toBeGreaterThanOrEqual(1);
    }
  });
});
