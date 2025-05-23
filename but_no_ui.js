// InventoryForm.jsx - A form for tracking currency/coin collections
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function InventoryForm() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("Note");
  const [region, setRegion] = useState("India");
  const [after1947, setAfter1947] = useState(true);
  const [rulerType, setRulerType] = useState("British");
  const [isCommemorative, setIsCommemorative] = useState(false);
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
      const response = await axios.get("http://localhost:5000/api/collection/recent?limit=3");
      
      if (response.status === 200) {
        setInventory(response.data);
      }
    } catch (error) {
      console.error("Error fetching recent items:", error);
      // If the endpoint doesn't exist, you might want to fetch all items and take the last 3
      try {
        const allItemsResponse = await axios.get("http://localhost:5000/api/collection");
        if (allItemsResponse.status === 200) {
          const allItems = allItemsResponse.data;
          // Take the last 3 items (most recent)
          const recentItems = allItems.slice(-3).reverse();
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

  // Load recent items when component mounts
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.photo.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    const itemData = {
      ...formData,
      type,
      region,
      after1947,
      rulerType,
      isCommemorative,
    };

    const formDataToSend = new FormData();

    // Append photos
    formData.photo.forEach((file) => {
      formDataToSend.append("photos", file);
    });

    // Append metadata
    formDataToSend.append("metadata", JSON.stringify(itemData));

    try {
      const res = await axios.post("http://localhost:5000/api/collection", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200 || res.status === 201) {
        alert("Saved to backend successfully!");
        
        // Refresh the recent items list after adding new item
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
      alert("Something went wrong while saving to backend.");
    }
  };

  const getImageUrl = (photo) => {
    if (!photo) return "";
    console.log("Photo object:", photo);
    
    // Handle different photo object structures from database
    if (typeof photo === 'string') {
      return `http://localhost:5000/uploads/${photo}`;
    }
    
    // From database - filename stored (most common case)
    if (photo.filename) {
      return `http://localhost:5000/uploads/${photo.filename}`;
    }
    
    // From database - path stored (with leading slash)
    if (photo.path) {
      // Remove leading slash if present to avoid double slashes
      const cleanPath = photo.path.startsWith('/') ? photo.path.substring(1) : photo.path;
      return `http://localhost:5000/${cleanPath}`;
    }
    
    // If it's a File object (newly uploaded, not yet saved)
    if (photo.name && photo instanceof File) {
      return URL.createObjectURL(photo);
    }
    
    return "";
  };

  const displayFields = () => {
    if (region === "Others") {
      return (
        <>
          <input type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="input-style" />
          <input type="text" name="currency" placeholder="Currency" value={formData.currency} onChange={handleChange} className="input-style" />
          <input type="text" name="denomination" placeholder="Denomination" value={formData.denomination} onChange={handleChange} className="input-style" />
          <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} className="input-style" />
          <input type="text" name="exchangeRate" placeholder="Exchange Rate" value={formData.exchangeRate} onChange={handleChange} className="input-style" />
          <textarea name="notes" placeholder="Additional Info" value={formData.notes} onChange={handleChange} className="input-style" />
        </>
      );
    }

    // Region is India
    return (
      <>
        <select onChange={(e) => setAfter1947(e.target.value === "true")} className="input-style" value={after1947.toString()}>
          <option value="true">After 1947</option>
          <option value="false">Before 1947</option>
        </select>

        {!after1947 ? (
          <>
            <select onChange={(e) => setRulerType(e.target.value)} className="input-style" value={rulerType}>
              <option value="British">British</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Kingdom/Samrajya">Kingdom/Samrajya</option>
            </select>
            <input type="text" name="ruler" placeholder="Ruler Name" value={formData.ruler || ""} onChange={handleChange} className="input-style" />
            <input type="text" name="metal" placeholder="Metal" value={formData.metal} onChange={handleChange} className="input-style" />
            <input type="text" name="coinValue" placeholder="Coin Value" value={formData.coinValue} onChange={handleChange} className="input-style" />
            <input type="text" name="weight" placeholder="Weight" value={formData.weight} onChange={handleChange} className="input-style" />
            <input type="text" name="script" placeholder="Script/Lekhi" value={formData.script} onChange={handleChange} className="input-style" />
            <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} className="input-style" />
            <input type="text" name="ruleDuration" placeholder="Rule Duration" value={formData.ruleDuration} onChange={handleChange} className="input-style" />
          </>
        ) : (
          <>
            <input type="text" name="denomination" placeholder="Denomination" value={formData.denomination} onChange={handleChange} className="input-style" />
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
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <input type="text" name="mint" placeholder="Mint" value={formData.mint} onChange={handleChange} className="input-style" />
            )}
            {type === "Coin" && (
              <>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="commemorative"
                    checked={isCommemorative}
                    onChange={(e) => setIsCommemorative(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="commemorative" className="text-sm">Commemorative Coin</label>
                </div>
                <div className="flex items-center gap-2 mt-2">
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
                    className="w-4 h-4"
                  />
                  <label htmlFor="mule" className="text-sm">Mule Coin</label>
                </div>

                {formData.isMule && (
                  <input
                    type="text"
                    name="muleDescription"
                    placeholder="Mule Description (e.g., mismatched dies)"
                    value={formData.muleDescription}
                    onChange={handleChange}
                    className="input-style"
                  />
                )}
                {isCommemorative && (
                  <>
                    <input 
                      type="text"
                      name="commemorativeNameFor"
                      placeholder="Name For"
                      value={formData.commemorativeNameFor}
                      onChange={handleChange}
                      className="input-style"
                    />
                    <input 
                      type="text"
                      name="commemorativeRange"
                      placeholder="Range"
                      value={formData.commemorativeRange}
                      onChange={handleChange}
                      className="input-style"
                    />
                  </>
                )}
              </>
            )}
            <input type="text" name="year" placeholder="Year" value={formData.year} onChange={handleChange} className="input-style" />
          </>
        )}
      </>
    );
  };

  const [selectedItem, setSelectedItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Currency &amp; Coin Collection</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Note">Note</option>
              <option value="Coin">Coin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select 
              value={region} 
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="India">India</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {displayFields()}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-medium mb-2">Collection Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text"
              name="purchaseValue" 
              placeholder="Purchase Value" 
              value={formData.purchaseValue}
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input 
              type="text"
              name="currentValue" 
              placeholder="Current Value" 
              value={formData.currentValue}
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acquisition Type</label>
              <select
                name="acquisitionType"
                value={formData.acquisitionType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="bought">Bought</option>
                <option value="seen">Seen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.acquisitionType === "bought" ? "Bought From" : "Seen On"}
              </label>
              <input 
                type="text"
                name="boughtFrom"
                placeholder={formData.acquisitionType === "bought" ? "e.g., Shop, Seller, Website" : "e.g., Exhibition, Friend, Place"}
                value={formData.boughtFrom}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <input 
              type="text"
              name="condition" 
              placeholder="Condition" 
              value={formData.condition}
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
          {formData.photo.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">{formData.photo.length} image(s) selected</p>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Add to Collection
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Recent Items ({inventory.length})</h2>
      {loading ? (
        <div className="bg-gray-100 p-8 text-center rounded-lg">
          <p className="text-gray-500">Loading recent items...</p>
        </div>
      ) : inventory.length === 0 ? (
        <div className="bg-gray-100 p-8 text-center rounded-lg">
          <p className="text-gray-500">No recent items found. Add items using the form above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((item, idx) => (
            <div 
              key={item._id || idx} 
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
              onClick={() => {
                setSelectedItem(item);
                setShowDialog(true);
                console.log("Selected item:", item);
              }}
            >
              {/* Fixed: Check for both 'photos' and 'photo' arrays */}
              {(item.photos || item.photo) && (item.photos || item.photo).length > 0 ? (
                <img
                  src={getImageUrl((item.photos || item.photo)[item.thumbnailIndex || 0])}
                  alt="thumbnail"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", e.target.src);
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                  }}
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              
              <div className="p-4">
                <h3 className="font-bold text-lg">
                  {item.denomination || item.coinValue} {item.currency}
                  {item.type === "Coin" && " (Coin)"}
                </h3>
                <p className="text-gray-600">{item.year}</p>
                <p className="text-gray-700">{item.region} • {item.issuer || item.mint || item.ruler}</p>
                {item.currentValue && (
                  <p className="mt-2 text-green-600 font-medium">Value: {item.currentValue}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simple Dialog for detailed view */}
      {showDialog && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-xl font-bold">Item Details</h3>
              <button 
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Fixed: Check for both 'photos' and 'photo' arrays in dialog */}
            {(selectedItem.photos || selectedItem.photo) && (selectedItem.photos || selectedItem.photo).length > 0 && (
              <img
                src={getImageUrl((selectedItem.photos || selectedItem.photo)[selectedItem.thumbnailIndex || 0])}
                alt="Selected item"
                className="w-full h-64 object-contain bg-gray-100"
                onError={(e) => {
                  console.error("Dialog image failed to load:", e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            )}
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{selectedItem.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Region</p>
                  <p className="font-medium">{selectedItem.region}</p>
                </div>
                {selectedItem.denomination && (
                  <div>
                    <p className="text-sm text-gray-500">Denomination</p>
                    <p className="font-medium">{selectedItem.denomination}</p>
                  </div>
                )}
                {selectedItem.coinValue && (
                  <div>
                    <p className="text-sm text-gray-500">Coin Value</p>
                    <p className="font-medium">{selectedItem.coinValue}</p>
                  </div>
                )}
                {selectedItem.year && (
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{selectedItem.year}</p>
                  </div>
                )}
                {selectedItem.issuer && (
                  <div>
                    <p className="text-sm text-gray-500">Issuer</p>
                    <p className="font-medium">{selectedItem.issuer}</p>
                  </div>
                )}
                {selectedItem.mint && (
                  <div>
                    <p className="text-sm text-gray-500">Mint</p>
                    <p className="font-medium">{selectedItem.mint}</p>
                  </div>
                )}
                {selectedItem.ruler && (
                  <div>
                    <p className="text-sm text-gray-500">Ruler</p>
                    <p className="font-medium">{selectedItem.ruler}</p>
                  </div>
                )}
                {selectedItem.metal && (
                  <div>
                    <p className="text-sm text-gray-500">Metal</p>
                    <p className="font-medium">{selectedItem.metal}</p>
                  </div>
                )}
                {selectedItem.script && (
                  <div>
                    <p className="text-sm text-gray-500">Script</p>
                    <p className="font-medium">{selectedItem.script}</p>
                  </div>
                )}
                {selectedItem.purchaseValue && (
                  <div>
                    <p className="text-sm text-gray-500">Purchase Value</p>
                    <p className="font-medium">{selectedItem.purchaseValue}</p>
                  </div>
                )}
                {selectedItem.currentValue && (
                  <div>
                    <p className="text-sm text-gray-500">Current Value</p>
                    <p className="font-medium">{selectedItem.currentValue}</p>
                  </div>
                )}
              </div>
              
              {selectedItem.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p>{selectedItem.notes}</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <button 
                onClick={() => setShowDialog(false)}
                className="w-full bg-gray-200 py-2 px-4 rounded hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
