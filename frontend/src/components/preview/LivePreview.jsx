import "../../styles/preview.css";

export default function LivePreview({ url, activeFile }) {
  if (!url || !activeFile?.endsWith(".html")) return null;

  return (
    <iframe
      key={url} // 🔥 forces refresh when url changes
      src={url}
      className="live-preview"
      sandbox="allow-scripts allow-same-origin"
      title="Live Preview"
    />
  );
}
