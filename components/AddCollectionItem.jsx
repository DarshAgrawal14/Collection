// src/components/AddCollectionItem.js
import React, { useState } from 'react';

const AddCollectionItem = () => {
  const [metadata, setMetadata] = useState({
    type: 'Coin',
    region: 'India',
    denomination: '',
    year: '',
    metal: '',
    condition: '',
    notes: '',
    after1947: true,
    isCommemorative: false
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewUrls];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponse(null);

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(metadata));
    images.forEach(img => formData.append('photos', img));

    try {
      const res = await fetch('http://localhost:5000/api/collection', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Upload failed');

      setResponse({ success: true, message: 'Item added!', item: data });
      setMetadata({
        type: 'Coin',
        region: 'India',
        denomination: '',
        year: '',
        metal: '',
        condition: '',
        notes: '',
        after1947: true,
        isCommemorative: false
      });
      setImages([]);
      setPreviewUrls([]);
    } catch (err) {
      setResponse({ success: false, message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded">
      <h2 className="text-xl font-bold mb-4">Add Collection Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            Type
            <select name="type" value={metadata.type} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="Coin">Coin</option>
              <option value="Note">Note</option>
            </select>
          </label>

          <label className="block">
            Region
            <input name="region" value={metadata.region} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>

          <label className="block">
            Denomination
            <input name="denomination" value={metadata.denomination} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>

          <label className="block">
            Year
            <input name="year" value={metadata.year} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>

          <label className="block">
            Metal
            <input name="metal" value={metadata.metal} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>

          <label className="block">
            Condition
            <input name="condition" value={metadata.condition} onChange={handleChange} className="w-full border p-2 rounded" />
          </label>
        </div>

        <label className="block">
          Notes
          <textarea name="notes" value={metadata.notes} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <div className="flex gap-4 items-center">
          <label>
            <input type="checkbox" name="after1947" checked={metadata.after1947} onChange={handleChange} />
            <span className="ml-2">After 1947</span>
          </label>
          <label>
            <input type="checkbox" name="isCommemorative" checked={metadata.isCommemorative} onChange={handleChange} />
            <span className="ml-2">Commemorative</span>
          </label>
        </div>

        <label className="block">
          Upload Photos
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="block mt-1" />
        </label>

        <div className="flex flex-wrap gap-2 mt-2">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative">
              <img src={url} alt="preview" className="w-24 h-24 object-cover border rounded" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {response && (
        <div className={`mt-4 p-2 rounded ${response.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {response.message}
        </div>
      )}
    </div>
  );
};

export default AddCollectionItem;
