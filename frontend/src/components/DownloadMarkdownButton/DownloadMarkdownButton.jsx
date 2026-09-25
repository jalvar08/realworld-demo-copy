import articleToMarkdown from "../../helpers/articleToMarkdown";

// REQ-059, REQ-060, AC-100, AC-101, AC-102, AC-103

function DownloadMarkdownButton({ article }) {
  const handleClick = () => {
    const { content, filename } = articleToMarkdown(article);
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="btn btn-sm btn-outline-secondary"
      onClick={handleClick}
      type="button"
    >
      <i className="ion-android-download"></i> Download .md
    </button>
  );
}

export default DownloadMarkdownButton;
