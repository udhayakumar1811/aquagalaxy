import { useState } from "react";
import { API_URL, getImageUrl } from "../../../config";
import { safeParseResponse } from "../../../utils/apiHandler";
import { getValidToken } from "../../../utils/auth";
import { FaTrash, FaArrowUp, FaArrowDown, FaStar, FaTimes, FaVideo } from "react-icons/fa";

// Admin panel for managing a single product's images and video (Priority 1
// of the media build-out — multi-image and video were previously
// schema-only fields with no way to actually populate them).
function ProductMediaManager({ product, token, onClose, onSaved, setMessage }) {
  const [mainImage, setMainImage] = useState(product.image);
  const [images, setImages] = useState(product.images || []);
  const [video, setVideo] = useState(product.video || null);
  const [videoThumbnail, setVideoThumbnail] = useState(product.videoThumbnail || null);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleImageFilesSelected = async (fileList) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;
    if (images.length + files.length > 8) {
      setLocalError("Maximum 8 gallery images per product.");
      return;
    }
    setLocalError("");
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    setUploadingImages(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      const res = await fetch(`${API_URL}/api/upload/multiple`, {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
        body: formData,
      });
      const data = await safeParseResponse(res, "Upload Multiple Images");
      setImages((prev) => [...prev, ...data.filePaths]);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleVideoFileSelected = async (file) => {
    if (!file) return;
    setLocalError("");
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("video", file);
      const res = await fetch(`${API_URL}/api/upload/video`, {
        method: "POST",
        headers: { Authorization: `Bearer ${currentToken}` },
        body: formData,
      });
      const data = await safeParseResponse(res, "Upload Video");
      setVideo(data.filePath);
      setVideoThumbnail(data.thumbnailPath);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const makeMainImage = (imgUrl) => {
    // Swap: the clicked gallery image becomes main; the old main image
    // moves into the gallery so it isn't lost.
    setImages((prev) => [mainImage, ...prev.filter((i) => i !== imgUrl)]);
    setMainImage(imgUrl);
  };

  const removeImage = (imgUrl) => {
    setImages((prev) => prev.filter((i) => i !== imgUrl));
  };

  const moveImage = (index, direction) => {
    setImages((prev) => {
      const next = [...prev];
      const swapWith = index + direction;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoThumbnail(null);
  };

  const handleSave = async () => {
    const currentToken = token || getValidToken();
    if (!currentToken) return;
    setSaving(true);
    setLocalError("");
    try {
      const res = await fetch(`${API_URL}/api/products/${product._id || product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${currentToken}` },
        body: JSON.stringify({ image: mainImage, images, video, videoThumbnail }),
      });
      const data = await safeParseResponse(res, "Save Product Media");
      setMessage(`✅ Media updated for "${product.name}"`);
      onSaved(data);
      onClose();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div onClick={onClose} className="admin-modal-overlay" role="dialog" aria-modal="true">
      <div onClick={(e) => e.stopPropagation()} className="admin-modal-card">
        <div className="admin-modal-header">
          <h2>Manage Media — {product.name}</h2>
          <button onClick={onClose} className="admin-modal-close-btn" type="button" aria-label="Close modal">
            <FaTimes />
          </button>
        </div>

        {localError && <p style={{ color: "#dc2626", fontSize: "13px", marginBottom: "12px" }}>{localError}</p>}

        {/* --- Main image --- */}
        <h3 style={{ marginTop: "12px", fontSize: "15px" }}>Main Image</h3>
        <img
          src={getImageUrl(mainImage)}
          alt="Main"
          style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "2px solid #0284c7" }}
        />

        {/* --- Gallery --- */}
        <h3 style={{ marginTop: "20px", fontSize: "15px" }}>Gallery Images ({images.length}/8)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
          {images.map((img, i) => (
            <div key={img + i} style={{ position: "relative", width: "90px" }}>
              <img
                src={getImageUrl(img)}
                alt={`Gallery ${i + 1}`}
                style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e2e8f0" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <button
                  type="button"
                  title="Set as main"
                  onClick={() => makeMainImage(img)}
                  style={{ background: "#fef3c7", border: "none", borderRadius: "4px", padding: "3px 5px", cursor: "pointer", color: "#b45309" }}
                >
                  <FaStar size={11} />
                </button>
                <button
                  type="button"
                  title="Move left"
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  style={{ background: "#f1f5f9", border: "none", borderRadius: "4px", padding: "3px 5px", cursor: i === 0 ? "not-allowed" : "pointer" }}
                >
                  <FaArrowUp size={11} />
                </button>
                <button
                  type="button"
                  title="Move right"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  style={{ background: "#f1f5f9", border: "none", borderRadius: "4px", padding: "3px 5px", cursor: i === images.length - 1 ? "not-allowed" : "pointer" }}
                >
                  <FaArrowDown size={11} />
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => removeImage(img)}
                  style={{ background: "#fee2e2", border: "none", borderRadius: "4px", padding: "3px 5px", cursor: "pointer", color: "#dc2626" }}
                >
                  <FaTrash size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleImageFilesSelected(e.target.files)}
          disabled={uploadingImages || images.length >= 8}
          style={{ fontSize: "13px" }}
        />
        {uploadingImages && <p style={{ fontSize: "13px", marginTop: "6px" }}>Uploading…</p>}

        {/* --- Video --- */}
        <h3 style={{ marginTop: "24px", fontSize: "15px" }}>Product Video (optional, ~20 seconds)</h3>
        {video ? (
          <div>
            <video src={getImageUrl(video)} controls muted style={{ width: "100%", maxWidth: "260px", borderRadius: "8px" }} />
            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
              <label style={{ background: "#f1f5f9", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                Replace
                <input type="file" accept="video/mp4,video/quicktime,video/webm" style={{ display: "none" }} onChange={(e) => handleVideoFileSelected(e.target.files[0])} />
              </label>
              <button
                type="button"
                onClick={removeVideo}
                style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
              >
                Delete Video
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f1f5f9", padding: "10px 14px", borderRadius: "6px", cursor: "pointer", width: "fit-content", fontSize: "13px" }}>
              <FaVideo /> {uploadingVideo ? "Uploading…" : "Upload Video (MP4/MOV/WEBM, max 25MB)"}
              <input type="file" accept="video/mp4,video/quicktime,video/webm" style={{ display: "none" }} disabled={uploadingVideo} onChange={(e) => handleVideoFileSelected(e.target.files[0])} />
            </label>
          </div>
        )}

        <div className="admin-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="submit-btn"
          >
            {saving ? "Saving…" : "Save Media"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductMediaManager;

