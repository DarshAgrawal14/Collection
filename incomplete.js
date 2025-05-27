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
  const [issuerSearch, setIssuerSearch] = useState("");
  const [showIssuerDropdown, setShowIssuerDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [scannerReady, setScannerReady] = useState(false);
  const [DWObject, setDWObject] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImages, setScannedImages] = useState([]);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);



  const [formData, setFormData] = useState({
    currency: "",
    country: "",
    denomination: "",
    year: "",
    isRare: false,
    rareReason: "",
    mint: "",
    inset: "",
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
    number: "",
    noteType: "",
    quantity: "1",
    photo: [],
    thumbnailIndex: 0,
    purchaseValue: "",
    currentValue: "",
    acquisitionType: "bought",
    canBeSold: false,
    boughtFrom: "",
    photo: [],
    deletedPhotos: [],
    exchangeRate: ""
  });

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
  " H. M. Patel (1955-1958)",
  "A. K. Roy (1958-1960)",
  "L. K . Jha(1960-1964)",
  "S. Bhoothlingam (1964-1966)",
  "S. Jagannathan (1967-1968)",
  "Dr. I. G. Patel (1968-1972)",
  "M. G. Kaul (1973-1976)",
  "Dr. Manmohan Singh (1976-1960)",
  "R. N. Malhotra (1980-1981)",
  "M. Narasimham (1981-1983)",
  "Pratap Kishan Kaul(1983-1985)",
  "S. Venkitaramanan (1985-1989)",
  "Gopi Kishan Aurora (1989-1990",
  "Bimal Jalan (1990-1991)",
  "S. P. Shukla (1991)",
  "Montek Singh Ahluwalia (1991-94)"
];


  const resetForm = () => {
    setFormData({
      currency: "", country: "", denomination: "", year: "", mint: "",
      commemorativeNameFor: "", commemorativeRange: "", issuer: "", material: "",
      metal: "", script: "", ruler: "", ruleDuration: "", coinValue: "", weight: "",
      series: "", condition: "", notes: "", purchaseValue: "", currentValue: "",
      acquisitionType: "bought", boughtFrom: "", exchangeRate: "", isRare: false,
      rareReason: "", isMule: false, muleDescription: "", number: "", noteType: "",
      quantity: 1, canBeSold: false, inset: "", deletedPhotos: [],
photo: []
    });
    setType("Note");
    setRegion("India");
    setAfter1947(true);
    setRulerType("British");
    setIsCommemorative(false);
    setIsUpdateMode(false);
    setItemToUpdate(null);
    setIssuerSearch("");
  };


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

  const populateFormForUpdate = (item) => {
    setFormData({
      currency: item.currency || '',
      country: item.country || '',
      denomination: item.denomination || '',
      year: item.year || '',
      mint: item.mint || '',
      commemorativeNameFor: item.commemorativeNameFor || '',
      commemorativeRange: item.commemorativeRange || '',
      issuer: item.issuer || '',
      material: item.material || '',
      metal: item.metal || '',
      script: item.script || '',
      ruler: item.ruler || '',
      ruleDuration: item.ruleDuration || '',
      coinValue: item.coinValue || '',
      weight: item.weight || '',
      series: item.series || '',
      condition: item.condition || '',
      notes: item.notes || '',
      purchaseValue: item.purchaseValue || '',
      currentValue: item.currentValue || '',
      acquisitionType: item.acquisitionType || 'bought',
      boughtFrom: item.boughtFrom || '',
      exchangeRate: item.exchangeRate || '',
      isRare: item.isRare || false,
      rareReason: item.rareReason || '',
      isMule: item.isMule || false,
      muleDescription: item.muleDescription || '',
      number: item.number || '',
      noteType: item.noteType || '',
      quantity: item.quantity || 1,
      canBeSold: item.canBeSold || false,
      inset: item.inset || '',
      photo: Array.isArray(item.photos) ? item.photos : [],
      deletedPhotos: []
    });


    setType(item.type || 'Note');
    setRegion(item.region || 'India');
    setAfter1947(item.after1947 ?? true);
    setRulerType(item.rulerType || 'British');
    setIsCommemorative(item.isCommemorative || false);

    setIsUpdateMode(true);
    setItemToUpdate(item);
    setIssuerSearch(item.issuer || '');
  };


  useEffect(() => {
    fetchRecentItems();
  }, []);

  useEffect(() => {
  // Initialize Dynamic Web TWAIN
    if (window.Dynamsoft && window.Dynamsoft.DWT) {
      window.Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
        const dwt = window.Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');
        if (dwt) {
          setDWObject(dwt);
          setScannerReady(true);
        }
      });
      
      window.Dynamsoft.DWT.Load();
    }
  }, []);

  const selectScanner = () => {
  if (DWObject) {
    DWObject.SelectSource(() => {
      console.log('Scanner selected successfully');
    }, (errorCode, errorString) => {
      alert('Scanner selection failed: ' + errorString);
    });
  }
};

  const scanDocument = () => {
    if (!DWObject) return;
    
  setIsScanning(true);
    DWObject.AcquireImage(
      () => {
        console.log('Scan successful');
        setIsScanning(false);
        // Convert scanned images to files
        convertScannedToFiles();
      },
      (errorCode, errorString) => {
        alert('Scan failed: ' + errorString);
        setIsScanning(false);
      }
    );
  };

  const convertScannedToFiles = () => {
    if (!DWObject || DWObject.HowManyImagesInBuffer === 0) return;
  
  const newScannedImages = [];
    for (let i = 0; i < DWObject.HowManyImagesInBuffer; i++) {
      DWObject.ConvertToBlob(
        [i],
        window.Dynamsoft.DWT.EnumDWT_ImageType.IT_JPG,
        (result, indices, type) => {
          const file = new File([result], `scanned_${Date.now()}_${i}.jpg`, { type: 'image/jpeg' });
          newScannedImages.push(file);
          
          if (newScannedImages.length === DWObject.HowManyImagesInBuffer) {
            setScannedImages(newScannedImages);
          }
        },
        (errorCode, errorString) => {
          console.error('Convert to blob failed:', errorString);
        }
      );
    }
  };

  const addScannedToForm = () => {
    if (scannedImages.length > 0) {
      setFormData(prev => ({
        ...prev,
        photo: [...prev.photo, ...scannedImages]
      }));
      setScannedImages([]);
      setShowScannerModal(false);
      // Clear DWObject buffer
      if (DWObject) {
        DWObject.RemoveAllImages();
      }
    }
  };

  const retryLastScan = () => {
    if (DWObject) {
      DWObject.RemoveAllImages();
      setScannedImages([]);
      scanDocument();
    }
  };

  const cropScannedImage = (index) => {
    if (DWObject && index < DWObject.HowManyImagesInBuffer) {
      DWObject.SelectImages([index]);
      // Show built-in image editor
      DWObject.ShowImageEditor();
    }
  };

  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[\W_]+/g, '')
      .trim();

  const filteredSignatories = (
  after1947 && formData.denomination.trim() === "1"
    ? financeSecretaries
    : rbiGovernors
).filter(name =>
  normalize(name).includes(normalize(issuerSearch))
);



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

  const selectGovernor = (governor) => {
    setIssuerSearch(governor);
    setFormData(prev => ({ ...prev, issuer: governor }));
    setShowIssuerDropdown(false);
  };


  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showImageGallery) return;
      
      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showImageGallery, galleryImages.length]);

  const removePhoto = (index) => {
    const photoToRemove = formData.photo[index];

    // If it's an existing photo (has _id or filename), track it for deletion
    if (photoToRemove._id || photoToRemove.filename) {
      setFormData((prev) => ({
        ...prev,
        deletedPhotos: [...prev.deletedPhotos, photoToRemove._id?.toString() || photoToRemove.filename],
        photo: prev.photo.filter((_, i) => i !== index),
      }));
    } else {
      // Just remove it if it's a new file (File object)
      setFormData((prev) => ({
        ...prev,
        photo: prev.photo.filter((_, i) => i !== index),
      }));
    }
  };


  const handleIssuerChange = (e) => {
    setIssuerSearch(e.target.value);
  };

  const openImageGallery = (images, startIndex = 0) => {
  setGalleryImages(images);
  setCurrentImageIndex(startIndex);
  setShowImageGallery(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const closeGallery = () => {
    setShowImageGallery(false);
    setGalleryImages([]);
    setCurrentImageIndex(0);
  };

  // Section Header Component
  const SectionHeader = ({ icon, title, description }) => (
    <div className="border-l-4 border-blue-500 pl-4 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        {title}
      </h3>
      {description && <p className="text-gray-600 text-sm mt-1">{description}</p>}
    </div>
  );

  // Mint Selection Component
  const MintSelection = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Mint Location</label>
      <select
        className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        onChange={(e) => setFormData(prev => ({ ...prev, mint: e.target.value }))}
        value={mintOptions.includes(formData.mint) ? formData.mint : ""}
      >
        <option value="">-- Select Mint --</option>
        {mintOptions.map((mint, idx) => (
          <option key={idx} value={mint}>{mint}</option>
        ))}
      </select>
      {!mintOptions.includes(formData.mint) && (
        <input
          type="text"
          name="mint"
          placeholder="Custom Mint (if not listed)"
          value={formData.mint}
          onChange={handleChange}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      )}
    </div>
  );
  const InsetSelection = () => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Inset Letter</label>
    <select
      className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      onChange={(e) => setFormData(prev => ({ ...prev, inset: e.target.value }))}
      value={formData.inset}
    >
      <option value="">-- Select Inset --</option>
      {insetOptions.map((inset, idx) => (
        <option key={idx} value={inset}>{inset}</option>
      ))}
    </select>
  </div>
);


  // Other Countries Form
  const renderOtherCountriesForm = () => (
    <div className="space-y-6">
      <SectionHeader 
        icon="🌍" 
        title="International Currency Details" 
        description="Enter details for non-Indian currency"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input 
          type="text" 
          name="country" 
          placeholder="Country" 
          value={formData.country} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
        <input 
          type="text" 
          name="currency" 
          placeholder="Currency" 
          value={formData.currency} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <input 
          type="text" 
          name="denomination" 
          placeholder="Denomination" 
          value={formData.denomination} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
        <input 
          type="text" 
          name="year" 
          placeholder="Year" 
          value={formData.year} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
        <input 
          type="text" 
          name="exchangeRate" 
          placeholder="Exchange Rate to INR" 
          value={formData.exchangeRate} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>
    </div>
  );

  // Pre-Independence Indian Form
  const renderPreIndependenceForm = () => (
    <div className="space-y-6">
      <SectionHeader 
        icon="🏛️" 
        title="Colonial Period Details" 
        description="Details for pre-1947 Indian currency"
      />
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Ruling Authority</label>
        <select 
          onChange={(e) => setRulerType(e.target.value)} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
          value={rulerType}
        >
          <option value="British">British Colonial</option>
          <option value="Portuguese">Portuguese Colonial</option>
          <option value="Kingdom/Samrajya">Indian Kingdom/Samrajya</option>
        </select>
      </div>

      {/* Ruler and (conditionally) Metal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input 
          type="text" 
          name="ruler" 
          placeholder="Ruler Name" 
          value={formData.ruler || ""} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
        
        {type === "Coin" && (
          <input 
            type="text" 
            name="metal" 
            placeholder="Metal Composition" 
            value={formData.metal} 
            onChange={handleChange} 
            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        )}
      </div>

      {/* Coin-only: Coin Value + Weight */}
      {type === "Coin" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
            type="text" 
            name="coinValue" 
            placeholder="Coin Value" 
            value={formData.coinValue} 
            onChange={handleChange} 
            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
          <input 
            type="text" 
            name="weight" 
            placeholder="Weight (grams)" 
            value={formData.weight} 
            onChange={handleChange} 
            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      )}

      {/* Always show: Year, Script, Rule Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input 
          type="text" 
          name="year" 
          placeholder="Year" 
          value={formData.year} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
        <input 
          type="text" 
          name="script" 
          placeholder="Script/Language" 
          value={formData.script} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>

      <div>
        <input 
          type="text" 
          name="ruleDuration" 
          placeholder="Rule Duration" 
          value={formData.ruleDuration} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
      </div>
    </div>
  );


  // Post-Independence Indian Form
  const renderPostIndependenceForm = () => (
    <div className="space-y-6">
      <SectionHeader 
        icon="🇮🇳" 
        title="Independent India Details" 
        description="Details for post-1947 Indian currency"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Denomination *</label>
          <input 
            type="text" 
            name="denomination" 
            placeholder="Enter denomination" 
            value={formData.denomination} 
            onChange={handleChange} 
            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            required
          />
        </div>

        {type === "Note" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {after1947 && formData.denomination.trim() === "1" ? "Finance Secretary" : "RBI Governor"}
            </label>
            <div className="relative">
              <input 
                type="text"
                name="issuer"
                placeholder={
                  after1947 && formData.denomination.trim() === "1"
                    ? "Finance Secretary"
                    : "RBI Governor"
                }
                value={issuerSearch}
                onChange={handleIssuerChange}
                onFocus={() => setShowIssuerDropdown(true)}
                onBlur={() => setTimeout(() => setShowIssuerDropdown(false), 200)}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                autoComplete="off"
              />
              
              {showIssuerDropdown && filteredSignatories.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredSignatories.map((governor, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onMouseDown={() => selectGovernor(governor)}
                    >
                      {governor}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <MintSelection />
        )}
      </div>

      {type === "Note" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-4">💵 Note Specific Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
          <label  className="block text-sm font-medium text-gray-700 mb-0.5 pl-[2px]">Note Serial Number</label>
            <input 
              type="text" 
              name="number" 
              placeholder="Note Serial Number" 
              value={formData.number || ""} 
              onChange={handleChange}
              className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5 pl-[2px]">Series</label>
            <input 
              type="text" 
              name="series" 
              placeholder="Series (e.g., L66, R23)" 
              value={formData.series || ""} 
              onChange={handleChange}
              className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-0.5 pl-[2px]">Note Type</label>
            <input 
              type="text" 
              name="noteType" 
              placeholder="Note Type" 
              value={formData.noteType || ""} 
              onChange={handleChange}
              className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            </div>
          </div>
          <div className="mt-4">
            <InsetSelection />
          </div>
        </div>
      )}
      
      {type === "Coin" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-800 mb-4">🪙 Coin Specific Details</h4>
          
          <div className="flex flex-wrap gap-6 mb-4">
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
            <div className="mb-4">
              <input
                type="text"
                name="muleDescription"
                placeholder="Mule Description (e.g., mismatched dies)"
                value={formData.muleDescription}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          )}
          
          {isCommemorative && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input 
                type="text"
                name="commemorativeNameFor"
                placeholder="Commemorated Person/Event"
                value={formData.commemorativeNameFor}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <input 
                type="text"
                name="commemorativeRange"
                placeholder="Series/Range"
                value={formData.commemorativeRange}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          )}

          <MintSelection />
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
        <input 
          type="text" 
          name="year" 
          placeholder="Enter year" 
          value={formData.year} 
          onChange={handleChange} 
          className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          required
        />
      </div>
    </div>
  );

  const displayFields = () => {
    if (region === "Others") {
      return renderOtherCountriesForm();
    }

    return (
      <div className="space-y-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Historical Period</label>
          <select 
            onChange={(e) => setAfter1947(e.target.value === "true")} 
            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
            value={after1947.toString()}
          >
            <option value="true">After 1947 (Independent India)</option>
            <option value="false">Before 1947 (Colonial Period)</option>
          </select>
        </div>

        {after1947 ? renderPostIndependenceForm() : renderPreIndependenceForm()}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

  if (formData.photo && formData.photo.length > 0) {
      formData.photo.forEach((file) => {
        formDataToSend.append("photos", file);
      });
    }

      if (formData.deletedPhotos && formData.deletedPhotos.length > 0) {
    itemData.deletedPhotos = formData.deletedPhotos;
  }


    formDataToSend.append("metadata", JSON.stringify(itemData));

    try {
      let res;
      if (isUpdateMode && itemToUpdate && itemToUpdate._id) {
        res = await axios.put(
          `http://localhost:5000/api/collection/${itemToUpdate._id}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.post(
          "http://localhost:5000/api/collection",
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (res.status === 200 || res.status === 201) {
        alert(`✅ Item ${isUpdateMode ? "updated" : "added"} successfully!`);
        await fetchRecentItems();
        resetForm();
      }
    } catch (err) {
      console.error("Error submitting to backend:", err);
      alert(`❌ Failed to ${isUpdateMode ? "update" : "save"} item.`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div id="dwtcontrolContainer" style={{ width: '100%', height: '500px' }} hidden></div>
          <h1 className="text-gray-600 mb-4">|| Narayan Narayan ||</h1>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🪙 Numismatic Collection Manager</h1>
          <p className="text-gray-600"> ~ Manish Agrawal</p>
        </div>
        
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <SectionHeader 
            icon="➕" 
            title="Add New Item" 
            description="Fill in the details to add a new item to your collection"
          />
          
          {/* Item Type and Region Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Item Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="Note">💵 Bank Note</option>
                <option value="Coin">🪙 Coin</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="India">🇮🇳 India</option>
                <option value="Others">🌍 Other Countries</option>
              </select>
            </div>
          </div>

          {/* Dynamic Fields */}
          {displayFields()}

          {/* Additional Notes */}
          <div className="mt-8">
            <SectionHeader 
              icon="📝" 
              title="Additional Information" 
            />
            <textarea 
              name="notes" 
              placeholder="Any additional information, special features, or notes about this item..." 
              value={formData.notes} 
              onChange={handleChange} 
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
            />
          </div>

          {/* Collection Details */}
          {/* Collection Details - This is where mark1.js ends, so this is the remaining part */}
          <div className="mt-8">
            <SectionHeader 
              icon="💰" 
              title="Collection & Value Information" 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select 
                  name="condition" 
                  value={formData.condition} 
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Select Condition</option>
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
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input 
                  type="number" 
                  name="quantity" 
                  placeholder="Quantity" 
                  value={formData.quantity} 
                  onChange={handleChange} 
                  min="1"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Value (₹)</label>
                <input 
                  type="number" 
                  name="purchaseValue" 
                  placeholder="Purchase Value" 
                  value={formData.purchaseValue} 
                  onChange={handleChange} 
                  step="0.01"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Value (₹)</label>
                <input 
                  type="number" 
                  name="currentValue" 
                  placeholder="Current Value" 
                  value={formData.currentValue} 
                  onChange={handleChange} 
                  step="0.01"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Acquisition Type</label>
                <select 
                  name="acquisitionType" 
                  value={formData.acquisitionType} 
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="bought">🛒 Purchased</option>
                  <option value="seen">👀 Seen (Not Owned)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.acquisitionType === "bought" ? "Purchased From" : 
                   formData.acquisitionType === "seen" ? "Seen At" : "Source"}
                </label>
                <input 
                  type="text" 
                  name="boughtFrom" 
                  placeholder={formData.acquisitionType === "bought" ? "Shop/Person/Website" : 
                              formData.acquisitionType === "seen" ? "Exhibition/Friend/Place" : "Source"} 
                  value={formData.boughtFrom} 
                  onChange={handleChange} 
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="canBeSold"
                checked={formData.canBeSold || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    canBeSold: e.target.checked,
                  }))
                }
                className="w-7 h-7 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
              />
              <label htmlFor="canBeSold" className="text-sm font-medium text-gray-800 ml-3">
                Can be Sold
              </label>
            </div>
          </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRare"
                  checked={formData.isRare}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isRare: e.target.checked,
                      rareReason: e.target.checked ? prev.rareReason : "",
                    }))
                  }
                  className="w-7 h-7 text-blue-600 rounded focus:ring-blue-600"
                />
                <label htmlFor="isRare" className="text-sm font-medium text-gray-800 ml-3">Mark as Rare Item</label>
              </div>
              
              {formData.isRare && (
                <div className="mt-3">
                  <textarea
                    name="rareReason"
                    placeholder="Why is this item rare? (e.g., printing error, low mintage, rare signature, limited edition)"
                    value={formData.rareReason}
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="mt-8">
            <SectionHeader 
              icon="📸" 
              title="Photo Upload" 
              description="Upload photos or scan directly from your scanner"
            />
            
            <div className="space-y-4">
              {/* Upload/Scanner Options */}
              <div className="flex gap-4 mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200 flex-1">
                  <input
                    type="file"
                    name="photo"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="text-gray-600">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      📱 Upload from Device
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG up to 10MB each</p>
                    </div>
                  </label>
                </div>
                
                {scannerReady && (
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-200 flex-1">
                    <button
                      type="button"
                      onClick={() => setShowScannerModal(true)}
                      className="w-full h-full flex flex-col items-center justify-center text-blue-600 hover:text-blue-700"
                    >
                      <svg className="h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      🖨️ Scan from Scanner
                      <p className="text-sm text-blue-500 mt-2">Use connected scanner/printer</p>
                    </button>
                  </div>
                )}
              </div>

              {/* Rest of your existing photo display code... */}

              {formData.photo.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Selected Photos ({formData.photo.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.photo.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {submitting
                ? (isUpdateMode ? "Updating..." : "Adding to Collection...")
                : (isUpdateMode ? "✅ Update Item" : "➕ Add to Collection")}
            </button>

            {isUpdateMode && (
              <button 
                type="button"
                onClick={resetForm}
                className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel Update
              </button>
            )}

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
                Are you sure you want to add this {type.toLowerCase()} to your{" "}
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                  ${formData.canBeSold 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-blue-100 text-blue-800 border border-blue-300'}`}>
                  {formData.canBeSold ?"🛒 Sale List":"📚 Collection" }
                </span>
                ?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4 text-left">
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> {type}<br/>
                  <strong>Region:</strong> {region}<br/>
                  <strong>Denomination:</strong> {formData.denomination || formData.coinValue}<br/>
                  <strong>Year:</strong> {formData.year}<br/>
                  <strong>Photos:</strong> {formData.photo.length}<br/>
                  <strong>Sellable:</strong> {formData.canBeSold ? "Yes" : "No"}
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
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openImageGallery((selectedItem.photos || selectedItem.photo), 0)}
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
                                onClick={() => openImageGallery((selectedItem.photos || selectedItem.photo), index + 1)}
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
                        <p className={`font-semibold ${selectedItem.canBeSold ? "text-blue-600" : "text-green-600"}`}>
                          {selectedItem.canBeSold ? "For Sale" : "For Collection"}
                        </p>


                      </div>
                    </div>

                    {selectedItem.notes && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-2">📝 Additional Notes</h5>
                        <p className="text-sm text-gray-700">{selectedItem.notes}</p>
                      </div>
                    )}
                    {/* Image Gallery Modal */}
{showImageGallery && (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]">
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={closeGallery}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
      >
        ×
      </button>
      
      {/* Image Counter */}
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
        {currentImageIndex + 1} / {galleryImages.length}
      </div>
      
      {/* Previous Button */}
      {galleryImages.length > 1 && (
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
        >
          ‹
        </button>
      )}
      
      {/* Current Image */}
      <img
        src={getImageUrl(galleryImages[currentImageIndex])}
        alt={`Gallery image ${currentImageIndex + 1}`}
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
        }}
      />
      
      {/* Next Button */}
      {galleryImages.length > 1 && (
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center"
        >
          ›
        </button>
      )}
      
      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black bg-opacity-50 p-2 rounded">
          {galleryImages.map((photo, index) => (
            <img
              key={index}
              src={getImageUrl(photo)}
              alt={`Thumbnail ${index + 1}`}
              className={`w-12 h-12 object-cover rounded cursor-pointer transition-opacity ${
                index === currentImageIndex ? 'opacity-100 ring-2 ring-white' : 'opacity-60 hover:opacity-80'
              }`}
              onClick={() => setCurrentImageIndex(index)}
              onError={(e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OWEzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OL0E8L3RleHQ+PC9zdmc+";
              }}
            />
          ))}
        </div>
      )}
    </div>
  </div>
)}
<button
  onClick={() => {
    populateFormForUpdate(selectedItem);
    setShowDialog(false); // close modal after clicking
  }}
  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
>
  ✏️ Update
</button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Scanner Modal */}
{showScannerModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">🖨️ Scanner Interface</h3>
        <button
          onClick={() => setShowScannerModal(false)}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Controls */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Scanner Controls</h4>
            
            <div className="space-y-3">
              <button
                onClick={selectScanner}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isScanning}
              >
                🔍 Select Scanner
              </button>
              
              <button
                onClick={scanDocument}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={isScanning || !scannerReady}
              >
                {isScanning ? '📄 Scanning...' : '📄 Scan Document'}
              </button>
              
              {scannedImages.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={retryLastScan}
                    className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    🔄 Retry Scan
                  </button>
                  <button
                    onClick={addScannedToForm}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✅ Add to Form
                  </button>
                </div>
              )}
            </div>
            
            {/* Hidden container for Dynamic Web TWAIN */}
            <div id="dwtcontrolContainer" style={{ width: '0px', height: '0px', display: 'none' }}></div>
          </div>
          
          {/* Scanned Images Preview */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Scanned Images Preview</h4>
            {scannedImages.length > 0 ? (
              <div className="space-y-4">
                {scannedImages.map((image, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Image {index + 1}</span>
                      <button
                        onClick={() => cropScannedImage(index)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        ✂️ Crop/Edit
                      </button>
                    </div>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Scanned ${index + 1}`}
                      className="w-full h-48 object-contain bg-gray-50 rounded"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">📄</div>
                <p>No scanned images yet</p>
                <p className="text-sm">Use the scanner controls to scan documents</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
