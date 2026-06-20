import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Trash2, Edit3, MessageSquare, User as UserIcon, Clock } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Button, Spinner } from "./ui";
import StarRating from "./ui/StarRating";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { user, accessToken } = useAuth();

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/review/product/${productId}`);
      setReviews(res.data.data.reviews);
      setStats(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const myReview = reviews.find((r) => r.user?._id === user?._id);
  const isAuthenticated = !!accessToken && !!user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        const res = await api.put(`/review/${editingId}`, form);
        setReviews((prev) => prev.map((r) => (r._id === editingId ? res.data.data : r)));
        setEditingId(null);
      } else {
        const res = await api.post("/review/create", { product: productId, ...form });
        setReviews((prev) => [res.data.data, ...prev]);
      }
      setForm({ rating: 5, comment: "" });
      const avgRes = await api.get(`/review/product/${productId}`);
      setStats(avgRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setForm({ rating: review.rating, comment: review.comment });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/review/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      const avgRes = await api.get(`/review/product/${productId}`);
      setStats(avgRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ rating: 5, comment: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-sm text-red-500">
        <p>{error}</p>
        <button onClick={fetchReviews} className="text-primary underline mt-1">Retry</button>
      </div>
    );
  }

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" /> Customer Reviews
      </h2>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-3xl font-black text-gray-900">{stats.average || 0}</p>
          <StarRating rating={Math.round(stats.average)} readonly size="sm" />
          <p className="text-xs text-gray-500 mt-1">{stats.count} review{stats.count !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Review Form */}
      {isAuthenticated && (!myReview || editingId) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {editingId ? "Edit Your Review" : "Write a Review"}
          </h3>
          <div className="mb-3">
            <StarRating rating={form.rating} onChange={(r) => setForm((p) => ({ ...p, rating: r }))} size="md" />
          </div>
          <textarea
            value={form.comment}
            onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
            placeholder="Share your experience with this product..."
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 resize-none"
            required
          />
          <div className="flex gap-2 mt-3">
            <Button type="submit" loading={submitting} size="sm">
              {editingId ? "Update" : "Submit"}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-2" />
          <p className="text-sm font-medium">No reviews yet</p>
          {!isAuthenticated && (
            <p className="text-xs mt-1">
              <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link> to leave a review
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isMine = review.user?._id === user?._id;
            const isAdmin = user?.role === "admin";
            return (
              <div key={review._id} className="p-4 bg-white rounded-xl border border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {review.user?.fullName || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} readonly size="sm" />
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {(isMine || isAdmin) && (
                    <div className="flex gap-1 shrink-0">
                      {isMine && (
                        <button
                          onClick={() => handleEdit(review)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
