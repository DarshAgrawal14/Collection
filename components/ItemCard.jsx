import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Eye, ShoppingBag, ChevronLeft, ChevronRight, ZoomIn, ArrowLeft } from 'lucide-react';

const NumismaticSearch = () => {
  const [itemType, setItemType] = useState('all');
  const [region, setRegion] = useState('all');
  const [after1947, setAfter1947] = useState(true);
  const [rulerType, setRulerType] = useState('British');
  const [searchFilters, setSearchFilters] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [issuerSearch, setIssuerSearch] = useState('');
  const [showIssuerDropdown, setShowIssuerDropdown] = useState(false);
  const [mintSearch, setMintSearch] = useState('');
  const [showMintDropdown, setShowMintDropdown] = useState(false);
  const [sellerSearch, setSellerSearch] = useState('');
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [sellerOptions, setSellerOptions] = useState([
    "Coin Bazaar", "eBay", "Heritage Auctions", "Local Dealer", "Coin Show", "Online Store", "Private Collection"
  ]);

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[\W_]+/g, '')
      .trim();

  const rbiGovernors = [
    "C. D. Deshmukh (11 Aug 1943 – 30 Jun 1949)",
    "Benegal Rama Rau (1 Jul 1949 – 14 Jan 1957)",
    "K. G. Ambegaonkar - Acting (14 Jan 1957 – 28 Feb 1957)",
    "H. V. R. Iengar (1 Mar 1957 – 28 Feb 1962)",
    "P. C. Bhattacharya (1 Mar 1962 – 30 Jun 1967)",
    "L. K. Jha (1 Jul 1967 – 3 May 1970)",
    "B. N. Adarkar - Acting (4 May 1970 – 15 Jun 1970)",
    "S. Jagannathan (16 Jun 1970 – 19 May 1975)",
    "N. C. Sen Gupta - Acting (19 May 1975 – 19 Aug 1975)",
    "K. R. Puri (20 Aug 1975 – 2 May 1977)",
    "M. Narasimham (2 May 1977 – 30 Nov 1977)",
    "I. G. Patel (1 Dec 1977 – 15 Sep 1982)",
    "Manmohan Singh (16 Sep 1982 – 14 Jan 1985)",
    "Amitav Ghosh - Acting (15 Jan 1985 – 4 Feb 1985)",
    "R. N. Malhotra (4 Feb 1985 – 22 Dec 1990)",
    "S. Venkitaramanan (22 Dec 1990 – 21 Dec 1992)",
    "C. Rangarajan (22 Dec 1992 – 21 Nov 1997)",
    "Bimal Jalan (22 Nov 1997 – 6 Sep 2003)",
    "Y. V. Reddy (6 Sep 2003 – 5 Sep 2008)",
    "D. Subbarao (5 Sep 2008 – 4 Sep 2013)",
    "Raghuram G. Rajan (4 Sep 2013 – 4 Sep 2016)",
    "Urjit R. Patel (4 Sep 2016 – 10 Dec 2018)",
    "Shaktikanta Das (12 Dec 2018 – Present)"
  ];

  const mintOptions = [
    "Mumbai (●)",
    "Hyderabad (★)",
    "Noida (◇)",
    "Kolkata (No Mark)",
    "Moscow (M)",
    "Heaton (H)",
    "Canada (C)"
  ];

  const insetOptions = [
    "None",
    "A - Mysore",
    "B - Mysore",
    "C - Mysore",
    "L - Mysore",
    "G - Salboni",
    "H - Salboni",
    "M - Salboni",
    "D - Dewas",
    "E - Nasik",
    "F - Nasik",
    "N - Nasik",
    "Star (★) - Replacement Note",
    "Other"
  ];

  const financeSecretaries = [
    "K. R. K. Menon (1949-1950)",
    "K. G. Ambegaonkar (1950-1955)",
    "H. M. Patel (1955-1958)",
    "A. K. Roy (1958-1960)",
    "L. K. Jha (1960-1964)",
    "S. Bhoothlingam (1964-1966)",
    "S. Jagannathan (1967-1968)",
    "Dr. I. G. Patel (1968-1972)",
    "M. G. Kaul (1973-1976)",
    "Dr. Manmohan Singh (1976-1980)",
    "R. N. Malhotra (1980-1981)",
    "M. Narasimham (1981-1983)",
    "Pratap Kishan Kaul (1983-1985)",
    "S. Venkitaramanan (1985-1989)",
    "Gopi Kishan Aurora (1989-1990)",
    "Bimal Jalan (1990-1991)",
    "S. P. Shukla (1991)",
    "Montek Singh Ahluwalia (1991-94)"
  ];

  // Load seller options from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("sellerOptions");
    if (saved) {
      setSellerOptions(JSON.parse(saved));
    }
  }, []);

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
    setIssuerSearch('');
    setMintSearch('');
    setSellerSearch('');
  };

  const performSearch = async () => {
    setIsSearching(true);

    const filtersToSend = {
      ...searchFilters,
      type: itemType !== 'all' ? (itemType === 'coins' ? 'Coin' : 'Note') : undefined,
      region: region !== 'all' ? region : undefined,
      after1947,
      rulerType: !after1947 ? rulerType : undefined,
    };

    // Clean up undefined or empty filters
    Object.keys(filtersToSend).forEach(key => {
      if (filtersToSend[key] === '' || filtersToSend[key] === undefined) {
        delete filtersToSend[key];
      }
    });

    try {
      // Mock data for demonstration
      const mockResults = [
        {
          _id: '1',
          type: 'Note',
          denomination: '10',
          currency: 'INR',
          year: '1996',
          condition: 'UNC',
          issuer: 'C. Rangarajan',
          region: 'India',
          acquisitionType: 'bought',
          photos: [
            { filename: 'note1-front.jpg' },
            { filename: 'note1-back.jpg' }
          ],
          notes: 'Beautiful condition with crisp edges',
          boughtFrom: 'Coin Bazaar',
          series: 'L66'
        },
        {
          _id: '2',
          type: 'Coin',
          denomination: '5',
          currency: 'INR',
          year: '2010',
          condition: 'AU',
          mint: 'Mumbai (●)',
          region: 'India',
          acquisitionType: 'seen',
          photos: [
            { filename: 'coin1-obverse.jpg' },
            { filename: 'coin1-reverse.jpg' }
          ],
          commemorativeNameFor: 'Commonwealth Games',
          notes: 'Special commemorative issue'
        }
      ];
      setSearchResults(mockResults);
    } catch (err) {
      console.error('Search error:', err);
      alert('Error while searching the collection.');
    } finally {
      setIsSearching(false);
    }
  };

  const openItemDetails = (item) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  const openGallery = (item, imageIndex = 0) => {
    setSelectedItem(item);
    setCurrentImageIndex(imageIndex);
    setShowGallery(true);
  };

  const nextImage = () => {
    if (selectedItem && selectedItem.photos) {
      setCurrentImageIndex((prev) => 
        prev < selectedItem.photos.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedItem && selectedItem.photos) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedItem.photos.length - 1
      );
    }
  };

  const getFilteredOptions = (options, searchTerm) => {
    if (!searchTerm) return options;
    return options.filter(option => 
      normalize(option).includes(normalize(searchTerm))
    );
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
          <div className="relative">
            <input
              type="text"
              placeholder={searchFilters.denomination?.trim() === "1" ? "Finance Secretary" : "RBI Governor"}
              value={issuerSearch}
              onChange={(e) => {
                setIssuerSearch(e.target.value);
                setShowIssuerDropdown(true);
              }}
              onFocus={() => setShowIssuerDropdown(true)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {showIssuerDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {getFilteredOptions(
                  searchFilters.denomination?.trim() === "1" ? financeSecretaries : rbiGovernors,
                  issuerSearch
                ).map((option, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => {
                      setIssuerSearch(option);
                      handleFilterChange('issuer', option);
                      setShowIssuerDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <select
            value={searchFilters.inset || ''}
            onChange={(e) => handleFilterChange('inset', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Inset</option>
            {insetOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </>
      )}
      
      {itemType === 'coins' && (
        <>
          <div className="relative">
            <input
              type="text"
              placeholder="Mint"
              value={mintSearch}
              onChange={(e) => {
                setMintSearch(e.target.value);
                setShowMintDropdown(true);
              }}
              onFocus={() => setShowMintDropdown(true)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {showMintDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {getFilteredOptions(mintOptions, mintSearch).map((option, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => {
                      setMintSearch(option);
                      handleFilterChange('mint', option);
                      setShowMintDropdown(false);
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
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
        
        <div className="relative">
          <input
            type="text"
            placeholder="Purchased From"
            value={sellerSearch}
            onChange={(e) => {
              setSellerSearch(e.target.value);
              setShowSellerDropdown(true);
            }}
            onFocus={() => setShowSellerDropdown(true)}
            className="w-full h-10 border border-gray-300 rounded-lg px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {showSellerDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {getFilteredOptions(sellerOptions, sellerSearch).map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                  onClick={() => {
                    setSellerSearch(option);
                    handleFilterChange('boughtFrom', option);
                    setShowSellerDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
              {sellerSearch && !sellerOptions.includes(sellerSearch) && (
                <div className="px-3 py-2 border-t border-gray-200">
                  <button
                    type="button"
                    className="text-blue-600 text-sm underline w-full text-left"
                    onClick={() => {
                      const updated = [...sellerOptions, sellerSearch];
                      setSellerOptions(updated);
                      localStorage.setItem("sellerOptions", JSON.stringify(updated));
                      handleFilterChange('boughtFrom', sellerSearch);
                      setShowSellerDropdown(false);
                    }}
                  >
                    Add "{sellerSearch}" to options
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
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

  const renderItemDetails = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedItem.type === 'Note' ? '💵' : '🪙'} Item Details
              </h2>
              <button
                onClick={() => setShowItemDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Images */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Images</h3>
                {selectedItem.photos && selectedItem.photos.length > 0 ? (
                  <div className="grid grid-cols-2