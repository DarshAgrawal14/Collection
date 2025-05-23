// InventoryForm.jsx - A form for tracking currency/coin collections
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function InventoryForm() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [type, setType] = useState("Note");
  const [region, setRegion] = useState("India");
  const [after1947, setAfter1947] = useState(true);
  const [rulerType, setRulerType] = useState("British");
  const [isCommemorative, setIsCommemorative] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    currency: "",
    country: "",
    denomination: "",
    year: "",
    mint: "",
    isMule: false,
    muleDescription: "",
    commemorativeNameFor: "",
    commemorativeRange: "",
    issuer: "",
    material: "",
    metal: "",
    script: "",
    ruler: "",
    ruleDuration: "",
    coinValue: "",
    weight: "",
    series: "",
    condition: "",
    notes: "",
    photo: [],
    thumbnailIndex: 0,
    purchaseValue: "",
    currentValue: "",
    acquisitionType: "bought",
    boughtFrom: "",
    exchangeRate: ""
  });

  // Fetch recent items from database
  const fetchRecentItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/collection/recent?limit=6");
      
      if (response.status === 200) {
        setInventory(response.data);
      }
    } catch (error) {
      console.error("Error fetching recent items:", error);
      try {
        const allItemsResponse = await axios.get("http://localhost:5000/api/collection");
        if (allItemsResponse.status === 200) {
          const allItems = allItemsResponse.data;
          const recentItems = allItems.slice(-6).reverse();
          setInventory(recentItems);
        }
      } catch (fallbackError) {
        console.error("Error fetching all items:", fallbackError);
        alert("Could not load recent items from database");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        photo: [...prev.photo, ...Array.from(files)],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photo: prev.photo.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.photo.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmDialog(false);
    setSubmitting(true);

    const itemData = {
      ...formData,
      type,
      region,
      after1947,
      rulerType,
      isCommemorative,
    };

    const formDataToSend = new FormData();

    formData.photo.forEach((file) => {
      formDataToSend.append("photos", file);
    });

    formDataToSend.append("metadata", JSON.stringify(itemData));

    try {
      const res = await axios.post("http://localhost:5000/api/collection", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        alert("✅ Item added to collection successfully!");
        
        await fetchRecentItems();
        
        // Reset form
        setFormData({
          currency: "",
          country: "",
          denomination: "",
          year: "",
          mint: "",
          commemorativeNameFor: "",
          commemorativeRange: "",
          issuer: "",
          material: "",
          metal: "",
          script: "",
          ruleDuration: "",
          coinValue: "",
          weight: "",
          series: "",
          condition: "",
          notes: "",
          photo: [],
          thumbnailIndex: 0,
          purchaseValue: "",
          currentValue: "",
          acquisitionType: "bought",
          boughtFrom: "",
          exchangeRate: "",
        });
      }
    } catch (err) {
      console.error("Error submitting to backend:", err);
      alert("❌ Something went wrong while saving to backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUrl = (photo) => {
    if (!photo) return "";
    
    if (typeof photo === 'string') {
      return `http://localhost:5000/uploads/${photo}`;
    }
    
    if (photo.filename) {
      return `http://localhost:5000/uploads/${photo.filename}`;
    }
    
    if (photo.path) {
      const cleanPath = photo.path.startsWith('/') ? photo.path.substring(1) : photo.path;
      return `http://localhost:5000/${cleanPath}`;
    }
    
    if (photo.name && photo instanceof File) {
      return URL.createObjectURL(photo);
    }
    
    return "";
  };

  const displayFields = () => {
    if (region === "Others") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              name="country" 
              placeholder="Country" 
              value={formData.country} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <input 
              type="text" 
              name="currency" 
              placeholder="Currency" 
              value={formData.currency} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="text" 
              name="denomination" 
              placeholder="Denomination" 
              value={formData.denomination} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <input 
              type="text" 
              name="year" 
              placeholder="Year" 
              value={formData.year} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
            <input 
              type="text" 
              name="exchangeRate" 
              placeholder="Exchange Rate" 
              value={formData.exchangeRate} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <textarea 
            name="notes" 
            placeholder="Additional Information" 
            value={formData.notes} 
            onChange={handleChange} 
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
          <select 
            onChange={(e) => setAfter1947(e.target.value === "true")} 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
            value={after1947.toString()}
          >
            <option value="true">After 1947 (Independent India)</option>
            <option value="false">Before 1947 (Colonial Period)</option>
          </select>
        </div>

        {!after1947 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ruling Authority</label>
              <select 
                onChange={(e) => setRulerType(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                value={rulerType}
              >
                <option value="British">British</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Kingdom/Samrajya">Kingdom/Samrajya</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="ruler" 
                placeholder="Ruler Name" 
                value={formData.ruler || ""} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <input 
                type="text" 
                name="metal" 
                placeholder="Metal" 
                value={formData.metal} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                name="coinValue" 
                placeholder="Coin Value" 
                value={formData.coinValue} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <input 
                type="text" 
                name="weight" 
                placeholder="Weight" 
                value={formData.weight} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <input 
                type="text" 
                name="year" 
                placeholder="Year" 
                value={formData.year} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="script" 
                placeholder="Script/Lekhi" 
                value={formData.script} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <input 
                type="text" 
                name="ruleDuration" 
                placeholder="Rule Duration" 
                value={formData.ruleDuration} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                name="denomination" 
                placeholder="Denomination" 
                value={formData.denomination} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              {type === "Note" ? (
                <input 
                  type="text"
                  name="issuer"
                  placeholder={
                    after1947 && formData.denomination.trim() === "1"
                      ? "Finance Secretary"
                      : "RBI Governor"
                  }
                  value={formData.issuer}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              ) : (
                <input 
                  type="text" 
                  name="mint" 
                  placeholder="Mint" 
                  value={formData.mint} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              )}
            </div>
            
            {type === "Coin" && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="commemorative"
                      checked={isCommemorative}
                      onChange={(e) => setIsCommemorative(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="commemorative" className="text-sm font-medium text-gray-700">Commemorative Coin</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="mule"
                      checked={formData.isMule}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isMule: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="mule" className="text-sm font-medium text-gray-700">Mule Coin</label>
                  </div>
                </div>

                {formData.isMule && (
                  <input
                    type="text"
                    name="muleDescription"
                    placeholder="Mule Description (e.g., mismatched dies)"
                    value={formData.muleDescription}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                )}
                
                {isCommemorative && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text"
                      name="commemorativeNameFor"
                      placeholder="Commemorated Person/Event"
                      value={formData.commemorativeNameFor}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <input 
                      type="text"
                      name="commemorativeRange"
                      placeholder="Series/Range"
                      value={formData.commemorativeRange}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                )}
              </div>
            )}
            
            <input 
              type="text" 
              name="year" 
              placeholder="Year" 
              value={formData.year} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🪙 Numismatic Collection Manager</h1>
          <p className="text-gray-600">Manage your currency and coin collection with ease</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Item</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="Note">💵 Bank Note</option>
                <option value="Coin">🪙 Coin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="India">🇮🇳 India</option>
                <option value="Others">🌍 Other Countries</option>
              </select>
            </div>
          </div>

          {displayFields()}

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Collection Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <input 
                type="text"
                name="purchaseValue" 
                placeholder="Purchase Value (₹)" 
                value={formData.purchaseValue}
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <input 
                type="text"
                name="currentValue" 
                placeholder="Current Value (₹)" 
                value={formData.currentValue}
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <input 
                type="text"
                name="condition" 
                placeholder="Condition (VF, XF, UNC)" 
                value={formData.condition}
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How did you acquire this?</label>
                <select
                  name="acquisitionType"
                  value={formData.acquisitionType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="bought">🛒 Purchased</option>
                  <option value="seen">👀 Seen (Not Owned)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.acquisitionType === "bought" ? "Purchased From" : "Seen At"}
                </label>
                <input 
                  type="text"
                  name="boughtFrom"
                  placeholder={formData.acquisitionType === "bought" ? "Shop, Seller, Website..." : "Exhibition, Friend, Place..."}
                  value={formData.boughtFrom}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📸 Photos</h3>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {formData.photo.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">Selected Photos ({formData.photo.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.photo.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {submitting ? "Adding to Collection..." : "➕ Add to Collection"}
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">📚 Recent Items ({inventory.length})</h2>
          {loading ? (
            <div className="bg-gray-50 p-12 text-center rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading recent items...</p>
            </div>
          ) : inventory.length === 0 ? (
            <div className="bg-gray-50 p-12 text-center rounded-lg">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">No items in your collection yet</p>
              <p className="text-gray-400">Add your first item using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inventory.map((item, idx) => (
                <div 
                  key={item._id || idx} 
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowDialog(true);
                  }}
                >
                  <div className="relative h-48 bg-gray-100">
                    {(item.photos || item.photo) && (item.photos || item.photo).length > 0 ? (
                      <img
                        src={getImageUrl((item.photos || item.photo)[item.thumbnailIndex || 0])}
                        alt="Item thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", e.target.src);
                          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">{item.type === "Coin" ? "🪙" : "💵"}</div>
                          <div className="text-sm">No Image</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                      {item.type}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                      {item.denomination || item.coinValue} {item.currency}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{item.year}</p>
                    <p className="text-gray-700 text-sm truncate mb-3">
                      {item.region} • {item.issuer || item.mint || item.ruler}
                    </p>
                    {item.currentValue && (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <p className="text-green-700 font-semibold text-sm">Value: ₹{item.currentValue}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">❓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Addition</h3>
              <p className="text-gray-600">
                Are you sure you want to add this {type.toLowerCase()} to your collection?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4 text-left">
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> {type}<br/>
                  <strong>Region:</strong> {region}<br/>
                  <strong>Denomination:</strong> {formData.denomination || formData.coinValue}<br/>
                  <strong>Year:</strong> {formData.year}<br/>
                  <strong>Photos:</strong> {formData.photo.length}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yes, Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Dialog */}
      {showDialog && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedItem.type === "Coin" ? "🪙" : "💵"} Item Details
              </h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">📸 Photos</h4>
                  {(selectedItem.photos || selectedItem.photo) && (selectedItem.photos || selectedItem.photo).length > 0 ? (
                    <div className="space-y-4">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl((selectedItem.photos || selectedItem.photo)[0])}
                          alt="Main view"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                          }}
                        />
                      </div>
                      {(selectedItem.photos || selectedItem.photo).length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                          {(selectedItem.photos || selectedItem.photo).slice(1).map((photo, index) => (
                            <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                              <img
                                src={getImageUrl(photo)}
                                alt={`View ${index + 2}`}
                                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onError={(e) => {
                                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-6xl mb-4">{selectedItem.type === "Coin" ? "🪙" : "💵"}</div>
                        <div className="text-lg">No Images Available</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">ℹ️ Item Information</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">Basic Details</h5>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Type:</span> {selectedItem.type}</p>
                        <p><span className="font-medium">Region:</span> {selectedItem.region}</p>
                        {selectedItem.country && <p><span className="font-medium">Country:</span> {selectedItem.country}</p>}
                        {selectedItem.currency && <p><span className="font-medium">Currency:</span> {selectedItem.currency}</p>}
                        <p><span className="font-medium">Denomination:</span> {selectedItem.denomination || selectedItem.coinValue}</p>
                        <p><span className="font-medium">Year:</span> {selectedItem.year}</p>
                        {selectedItem.condition && <p><span className="font-medium">Condition:</span> {selectedItem.condition}</p>}
                      </div>
                    </div>

                    {selectedItem.region === "India" && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2">
                          {selectedItem.after1947 ? "Post-Independence Details" : "Colonial Period Details"}
                        </h5>
                        <div className="space-y-2 text-sm">
                          {selectedItem.after1947 ? (
                            <>
                              {selectedItem.issuer && <p><span className="font-medium">Issuer:</span> {selectedItem.issuer}</p>}
                              {selectedItem.mint && <p><span className="font-medium">Mint:</span> {selectedItem.mint}</p>}
                              {selectedItem.isCommemorative && (
                                <>
                                  <p><span className="font-medium">Type:</span> Commemorative Coin</p>
                                  {selectedItem.commemorativeNameFor && <p><span className="font-medium">Commemorates:</span> {selectedItem.commemorativeNameFor}</p>}
                                  {selectedItem.commemorativeRange && <p><span className="font-medium">Series:</span> {selectedItem.commemorativeRange}</p>}
                                </>
                              )}
                              {selectedItem.isMule && (
                                <>
                                  <p><span className="font-medium">Type:</span> Mule Coin</p>
                                  {selectedItem.muleDescription && <p><span className="font-medium">Mule Details:</span> {selectedItem.muleDescription}</p>}
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              {selectedItem.rulerType && <p><span className="font-medium">Authority:</span> {selectedItem.rulerType}</p>}
                              {selectedItem.ruler && <p><span className="font-medium">Ruler:</span> {selectedItem.ruler}</p>}
                              {selectedItem.ruleDuration && <p><span className="font-medium">Rule Period:</span> {selectedItem.ruleDuration}</p>}
                              {selectedItem.metal && <p><span className="font-medium">Metal:</span> {selectedItem.metal}</p>}
                              {selectedItem.weight && <p><span className="font-medium">Weight:</span> {selectedItem.weight}</p>}
                              {selectedItem.script && <p><span className="font-medium">Script:</span> {selectedItem.script}</p>}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedItem.exchangeRate && (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2">Exchange Information</h5>
                        <p className="text-sm"><span className="font-medium">Exchange Rate:</span> {selectedItem.exchangeRate}</p>
                      </div>
                    )}

                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">💰 Collection Information</h5>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Acquisition:</span> {selectedItem.acquisitionType === "bought" ? "Purchased" : "Seen"}</p>
                        {selectedItem.boughtFrom && (
                          <p><span className="font-medium">{selectedItem.acquisitionType === "bought" ? "Purchased From" : "Seen At"}:</span> {selectedItem.boughtFrom}</p>
                        )}
                        {selectedItem.purchaseValue && <p><span className="font-medium">Purchase Value:</span> ₹{selectedItem.purchaseValue}</p>}
                        {selectedItem.currentValue && <p><span className="font-medium">Current Value:</span> ₹{selectedItem.currentValue}</p>}
                        {selectedItem.purchaseValue && selectedItem.currentValue && (
                          <p className={`font-medium ${parseFloat(selectedItem.currentValue) > parseFloat(selectedItem.purchaseValue) ? 'text-green-600' : parseFloat(selectedItem.currentValue) < parseFloat(selectedItem.purchaseValue) ? 'text-red-600' : 'text-gray-600'}`}>
                            Change: {parseFloat(selectedItem.currentValue) > parseFloat(selectedItem.purchaseValue) ? '+' : ''}
                            ₹{(parseFloat(selectedItem.currentValue) - parseFloat(selectedItem.purchaseValue)).toFixed(2)}
                            {' '}({((parseFloat(selectedItem.currentValue) - parseFloat(selectedItem.purchaseValue)) / parseFloat(selectedItem.purchaseValue) * 100).toFixed(1)}%)
                          </p>
                        )}
                      </div>
                    </div>

                    {selectedItem.notes && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2">📝 Additional Notes</h5>
                        <p className="text-sm text-gray-700">{selectedItem.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
