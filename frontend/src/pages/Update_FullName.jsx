import React, { useState } from 'react';
import api from '../api/axios'; // Adjust this path as needed
import { createPortal } from 'react-dom';

const UpdateFullName = ({ id, isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.put(`user/update/${id}`, { fullName }, {
        withCredentials: true,
      });

      setMessage('Full name updated successfully!');
      setTimeout(() => {
        onClose(); // Close modal after success
      }, 1500);
    } catch (err) {
      console.error('Error updating full name:', err);
      setMessage('Failed to update full name.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Update Full Name</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Enter new full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
};

export default UpdateFullName;
