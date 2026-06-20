import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import api from "../api/axios";
import { Button } from "../components/ui";

const UpdateFullName = ({ id, isOpen, onClose }) => {
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) setFullName("");
    setMessage("");
  }, [isOpen]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      await api.put(`/user/update/${id}`, { fullName }, { withCredentials: true });
      setMessage("Full name updated!");
      setTimeout(() => { onClose(); window.location.reload(); }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-gray-200 shadow-xl p-6 w-full max-w-sm relative animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-bold text-gray-900 mb-1">Change Name</h2>
        <p className="text-sm text-gray-500 mb-5">Update your full name</p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Enter new full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          />
          <Button type="submit" loading={loading} className="w-full" size="md">
            {loading ? "Updating..." : "Update"}
          </Button>
        </form>

        {message && (
          <p className={`mt-3 text-center text-sm font-medium ${message.includes("success") || message.includes("updated") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>,
    document.body
  );
};

export default UpdateFullName;
