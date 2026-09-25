import readingTime from "../../helpers/readingTime";

// REQ-053/REQ-054: renders the "N min read" badge computed from the
// article's current body, alongside (never replacing) the existing date.
function ReadingTime({ body }) {
  return <span className="reading-time"> · {readingTime(body)} min read</span>;
}

export default ReadingTime;
