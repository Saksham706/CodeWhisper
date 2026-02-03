import "../../styles/preview.css";

export default function LivePreview({ url }) {
  if (!url) return null;

  return (
    <iframe
      src={url}
      title="preview"
      className="live-preview"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
