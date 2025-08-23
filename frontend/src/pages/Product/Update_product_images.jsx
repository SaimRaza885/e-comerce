import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const ProductImagesUpdate = () => {
  const { id } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + previewUrls.length > 4) {
      alert("You can only upload a maximum of 4 images.");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file); // backend expects req.files
    });

    try {
      setUploading(true);
      setMessage("");
      const res = await api.put(`/product/images/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "Images updated successfully!");
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Update Product Images
      </h1>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block mb-2 text-gray-600 font-medium">
          Select Images (max 4)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0 file:text-sm file:font-semibold
          file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
        />
      </div>

      {/* Preview */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {previewUrls.map((url, i) => (
            <div
              key={i}
              className="relative w-full h-32 rounded-lg overflow-hidden border"
            >
              <img
                src={url}
                alt="preview"
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow hover:bg-red-600"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md transition disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>

      {/* Message */}
      {message && (
        <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default ProductImagesUpdate;
