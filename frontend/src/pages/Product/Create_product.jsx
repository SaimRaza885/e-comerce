import React, { useState } from 'react';
import api from "../../api/axios";
import { useNavigate } from 'react-router-dom';
import BackArrow from "../../components/BackArrow"

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    title: '', urdu_name: '', description: '', price: '', inStock: true, stock: ''
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate =useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) return setError('Max 4 images allowed');
    setImages(prev => [...prev, ...files]);
    setError('');
  };

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);

    if (!formData.title || !formData.urdu_name || !formData.price || !formData.stock)
      return setError('Title, Urdu name, price, and stock are required');
    if (!images.length) return setError('At least one image is required');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      images.forEach(img => data.append('images', img));

      const res = await api.post('product/create', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(res.data.datacd);
      setFormData({ title: '', urdu_name: '', description: '', price: '', inStock: true, stock: '' });
      setImages([]);
      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { label: 'Title', name: 'title', type: 'text', required: true },
    { label: 'Urdu Name', name: 'urdu_name', type: 'text', required: true },
    { label: 'Description', name: 'description', type: 'textarea', rows: 4 },
    { label: 'Price', name: 'price', type: 'number', min: 0, step: 0.01, required: true },
    { label: 'Stock Quantity', name: 'stock', type: 'number', min: 0, required: true }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <BackArrow navigateto={-1}/>
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Product</h2>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {inputs.map(({ label, name, type, ...rest }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {type === 'textarea' ? (
              <textarea
                name={name} value={formData[name]} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...rest}
              />
            ) : (
              <input
                type={type} name={name} value={formData[name]} onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                {...rest}
              />
            )}
          </div>
        ))}

        <div className="flex items-center">
          <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
          <span className="ml-2 text-sm text-gray-700">In Stock</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Images (Max 4)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img src={URL.createObjectURL(img)} alt="" className="h-24 w-24 object-cover rounded"/>
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">&times;</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
