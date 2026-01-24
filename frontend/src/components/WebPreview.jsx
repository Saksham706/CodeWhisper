import { useEffect, useState } from "react";
import "./webPreview.css";

export default function WebPreview({ file }) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1); // 🔥 force iframe reload
  }, [file]);

  if (!file) return null;

  return (
    <div className="web-preview">
      <div className="preview-header">PREVIEW</div>
      <iframe
        key={key}
        src={`http://localhost:5000/preview/${file}`}
        title="preview"
      />
    </div>
  );
}
