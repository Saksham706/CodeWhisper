import "./livePreview.css";

export default function LivePreview({ url }) {
  if (!url) return null;

  return (
    <div className="preview-container">
      <div className="preview-header">
        <span>🌐 Live Preview</span>
        <a href={url} target="_blank" rel="noreferrer">
          Open in new tab
        </a>
      </div>

      <iframe
        src={url}
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
