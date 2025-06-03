import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported at top
import { Search, Filter, X, Eye, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const NumismaticSearch = () => {
  const [itemType, setItemType] = useState('all');
  const [region, setRegion] = useState('all');
  const [after1947, setAfter1947] = useState(true);
  const [rulerType, setRulerType] = useState('British');
  const [searchFilters, setSearchFilters] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const navigate = useNavigate();

  const handleFilterChange = (name, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilter = (filterName) => {
    setSearchFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterName];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setSearchFilters({});
    setItemType('all');
    setRegion('all');
    setAfter1947(true);
    setRulerType('British');
  };

  

const performSearch = async () => {
  setIsSearching(true);

  const filtersToSend = {
  ...searchFilters,
  type: itemType !== 'all' ? (itemType === 'coins' ? 'Coin' : 'Note') : undefined,
  region: region !== 'all' ? region : undefined,
  after1947: region === 'India' ? after1947 : undefined,
  rulerType: region === 'India' && !after1947 ? rulerType : undefined,
};


  // Clean up undefined or empty filters
  Object.keys(filtersToSend).forEach(key => {
    if (filtersToSend[key] === '' || filtersToSend[key] === undefined) {
      delete filtersToSend[key];
    }
  });

  try {
    const res = await axios.post('http://localhost:5000/api/collection/search', filtersToSend);
    setSearchResults(res.data);
  } catch (err) {
    console.error('Search error:', err);
    alert('Error while searching the collection.');
  } finally {
    setIsSearching(false);
  }
};

  const SectionHeader = ({ icon, title, description }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      {description && <p className="text-gray-600 text-sm">{description}</p>}
    </div>
  );

  const renderIndianPostIndependenceFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="Denomination"
        value={searchFilters.denomination || ''}
        onChange={(e) => handleFilterChange('denomination', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      {itemType === 'notes' && (
        <>
          <input
            type="text"
            placeholder="RBI Governor/Finance Secretary"
            value={searchFilters.issuer || ''}
            onChange={(e) => handleFilterChange('issuer', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Series (e.g., L66, R23)"
            value={searchFilters.series || ''}
            onChange={(e) => handleFilterChange('series', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Note Serial Number"
            value={searchFilters.number || ''}
            onChange={(e) => handleFilterChange('number', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </>
      )}
      
      {itemType === 'coins' && (
        <>
          <input
            type="text"
            placeholder="Mint"
            value={searchFilters.mint || ''}
            onChange={(e) => handleFilterChange('mint', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Commemorated Person/Event"
            value={searchFilters.commemorativeNameFor || ''}
            onChange={(e) => handleFilterChange('commemorativeNameFor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </>
      )}
      
      <input
        type="text"
        placeholder="Year"
        value={searchFilters.year || ''}
        onChange={(e) => handleFilterChange('year', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const renderIndianPreIndependenceFields = () => (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ruling Authority</label>
        <select 
          value={rulerType}
          onChange={(e) => setRulerType(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="British">British Colonial</option>
          <option value="Portuguese">Portuguese Colonial</option>
          <option value="Kingdom/Samrajya">Indian Kingdom/Samrajya</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Ruler Name"
          value={searchFilters.ruler || ''}
          onChange={(e) => handleFilterChange('ruler', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {rulerType === "Kingdom/Samrajya" && (
          <input
            type="text"
            placeholder="Kingdom/Empire"
            value={searchFilters.kingdomName || ''}
            onChange={(e) => handleFilterChange('kingdomName', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
        
        <input
          type="text"
          placeholder="Rule Period"
          value={searchFilters.ruleDuration || ''}
          onChange={(e) => handleFilterChange('ruleDuration', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        {itemType === 'coins' && (
          <>
            <input
              type="text"
              placeholder="Metal Composition"
              value={searchFilters.metal || ''}
              onChange={(e) => handleFilterChange('metal', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Denomination"
              value={searchFilters.coinValue || ''}
              onChange={(e) => handleFilterChange('coinValue', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Weight (Grams)"
              value={searchFilters.weight || ''}
              onChange={(e) => handleFilterChange('weight', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </>
        )}
        
        <input
          type="text"
          placeholder="Year"
          value={searchFilters.year || ''}
          onChange={(e) => handleFilterChange('year', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <input
          type="text"
          placeholder="Script/Language"
          value={searchFilters.script || ''}
          onChange={(e) => handleFilterChange('script', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderOtherCountriesFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="Country"
        value={searchFilters.country || ''}
        onChange={(e) => handleFilterChange('country', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Currency"
        value={searchFilters.currency || ''}
        onChange={(e) => handleFilterChange('currency', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Denomination"
        value={searchFilters.denomination || ''}
        onChange={(e) => handleFilterChange('denomination', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Year"
        value={searchFilters.year || ''}
        onChange={(e) => handleFilterChange('year', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Exchange Rate to INR"
        value={searchFilters.exchangeRate || ''}
        onChange={(e) => handleFilterChange('exchangeRate', e.target.value)}
        className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );

  const renderCommonFields = () => (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-800 mb-3">Additional Filters</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <select
          value={searchFilters.condition || ''}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Any Condition</option>
          <option value="UNC">UNC (Uncirculated)</option>
          <option value="AU">AU (About Uncirculated)</option>
          <option value="XF">XF (Extremely Fine)</option>
          <option value="VF">VF (Very Fine)</option>
          <option value="F">F (Fine)</option>
          <option value="VG">VG (Very Good)</option>
          <option value="G">G (Good)</option>
          <option value="Poor">Poor</option>
          <option value="Proof">Proof</option>
        </select>
        
        <select
          value={searchFilters.acquisitionType || ''}
          onChange={(e) => handleFilterChange('acquisitionType', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Any Type</option>
          <option value="bought">🛒 Purchased</option>
          <option value="seen">👀 Seen (Not Owned)</option>
        </select>
        
        <input
          type="text"
          placeholder="Purchased From"
          value={searchFilters.boughtFrom || ''}
          onChange={(e) => handleFilterChange('boughtFrom', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <input
          type="text"
          placeholder="Notes/Keywords"
          value={searchFilters.notes || ''}
          onChange={(e) => handleFilterChange('notes', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderActiveFilters = () => {
    const activeFilters = Object.keys(searchFilters).filter(key => searchFilters[key]);
    const mainFilters = [];
    
    if (itemType !== 'all') mainFilters.push({ key: 'itemType', value: itemType, label: `Type: ${itemType}` });
    if (region !== 'all') mainFilters.push({ key: 'region', value: region, label: `Region: ${region}` });
    
    if (activeFilters.length === 0 && mainFilters.length === 0) return null;

    return (
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-800">Active Filters</h4>
          <button
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Clear All
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {mainFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {filter.label}
              <button
                onClick={() => filter.key === 'itemType' ? setItemType('all') : setRegion('all')}
                className="ml-1 hover:text-blue-600"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {activeFilters.map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
            >
              {key}: {searchFilters[key]}
              <button
                onClick={() => clearFilter(key)}
                className="ml-1 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderSearchResults = () => (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Search Results ({searchResults.length} items)
        </h3>
      </div>
      
      {searchResults.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Search size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No items found matching your criteria</p>
          <p className="text-sm">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((item) => (
            
                          <div
                key={item._id}
                className="cursor-pointer bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                onClick={() => setSelectedItem(item)}
              >
            <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{item.type === 'Note' ? '💵' : '🪙'}</span>
                <div className="flex items-center gap-1">
                  {item.acquisitionType === 'bought' ? <ShoppingBag size={16} className="text-green-600" /> : <Eye size={16} className="text-gray-600" />}
                  <span className="text-xs text-gray-500">{item.acquisitionType}</span>
                </div>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                <div className="h-40 mb-4 bg-gray-100 rounded overflow-hidden">
                  {item.photos && item.photos.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${item.photos[0].filename}`}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                      No Image
                    </div>
                  )}
                </div>

                {item.region === 'India' ? '🇮🇳' : '🌍'} {item.denomination || item.coinValue} {item.currency || 'INR'}
              </h4>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Year:</strong> {item.year}</p>
                <p><strong>Condition:</strong> {item.condition}</p>
                {item.issuer && <p><strong>Issuer:</strong> {item.issuer}</p>}
                {item.ruler && <p><strong>Ruler:</strong> {item.ruler}</p>}
                {item.country && <p><strong>Country:</strong> {item.country}</p>}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/update/${item._id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ✏️ Update
                </button>

              </div>

              </div>
            </div>
            </div>

            
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-gray-600 mb-4">|| Narayan Narayan ||</h1>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Search Collection</h1>
          <p className="text-gray-600">~ Manish Agrawal</p>
        </div>


        {showUpdateForm && selectedItem && (
  <div className="bg-yellow-50 rounded-xl shadow-xl p-6 mb-8 border border-yellow-300">
    <h2 className="text-xl font-bold text-yellow-800 mb-4">✏️ Update Item</h2>
    
    {/* Example: just showing how to edit a few fields */}
    <input
      type="text"
      placeholder="Denomination"
      value={selectedItem.denomination || ''}
      onChange={(e) =>
        setSelectedItem({ ...selectedItem, denomination: e.target.value })
      }
      className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4"
    />

    <input
      type="text"
      placeholder="Year"
      value={selectedItem.year || ''}
      onChange={(e) =>
        setSelectedItem({ ...selectedItem, year: e.target.value })
      }
      className="w-full h-10 border border-gray-300 rounded-lg px-3 mb-4"
    />

    {/* Add more fields as needed... */}

    <div className="flex gap-4">
      <button
        onClick={async () => {
          try {
            const res = await axios.put(
              `http://localhost:5000/api/collection/${selectedItem._id}`,
              selectedItem // must match backend schema, or wrap in FormData if files involved
            );
            alert('✅ Updated successfully!');
            setShowUpdateForm(false);
            performSearch(); // refresh
          } catch (err) {
            console.error('Update failed:', err);
            alert('❌ Update failed.');
          }
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
      >
        Save Changes
      </button>
      <button
        onClick={() => setShowUpdateForm(false)}
        className="text-red-500 hover:underline"
      >
        Cancel
      </button>
    </div>
  </div>
)}

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <SectionHeader 
            icon="🔎" 
            title="Search Filters" 
            description="Use the filters below to find specific items in your collection"
          />

          {/* Primary Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Item Type</label>
              <select 
                value={itemType} 
                onChange={(e) => setItemType(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">🔍 All Items</option>
                <option value="notes">💵 Bank Notes</option>
                <option value="coins">🪙 Coins</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">🌐 All Regions</option>
                <option value="India">🇮🇳 India</option>
                <option value="Others">🌍 Other Countries</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fields Based on Selection */}
          {region === 'India' && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="indianPeriod"
                    checked={after1947}
                    onChange={() => setAfter1947(true)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Post-Independence (After 1947)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="indianPeriod"
                    checked={!after1947}
                    onChange={() => setAfter1947(false)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Pre-Independence (Before 1947)</span>
                </label>
              </div>

              {after1947 ? (
                <div>
                  <SectionHeader 
                    icon="🇮🇳" 
                    title="Independent India Filters" 
                  />
                  {renderIndianPostIndependenceFields()}
                </div>
              ) : (
                <div>
                  <SectionHeader 
                    icon="🏛️" 
                    title="Colonial Period Filters" 
                  />
                  {renderIndianPreIndependenceFields()}
                </div>
              )}
            </div>
          )}

          {region === 'Others' && (
            <div className="mb-6">
              <SectionHeader 
                icon="🌍" 
                title="International Currency Filters" 
              />
              {renderOtherCountriesFields()}
            </div>
          )}

          {/* Common Fields */}
          {(region !== 'all' || itemType !== 'all') && renderCommonFields()}

          {/* Active Filters */}
          {renderActiveFilters()}

          {/* Search Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={performSearch}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search Collection
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default NumismaticSearch;
