// REQ-053: estimated reading time is derived from word count at a fixed
// words-per-minute rate, rounded up, with a minimum of 1 minute.
const WORDS_PER_MINUTE = 200;

export default function readingTime(body) {
  const words = (body || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const minutes = Math.ceil(words.length / WORDS_PER_MINUTE);

  return Math.max(1, minutes);
}
