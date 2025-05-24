import React, { useState, useEffect } from "react";
import axios from "axios";
import SharedFields from "./SharedFields";

export default function SearchPage() {
  const [formData, setFormData] = useState({
    year: "",
    denomination: "",
    issuer: "",
    mint: "",
    currency: "",
    coinValue: "",
  });

  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [after1947, setAfter1947] = useState(true);
  const [isCommemorative, setIsCommemorative] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchResults = async () => {
    const payload = {
      ...formData,
      type,
      region,
      after1947,
      isCommemorative,
    };

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/collection/search", payload);
      setResults(response.data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">🔍 Search Collection</h1>
      
      <form onSubmit={(e) => { e.preventDefault(); fetchResults(); }} className="mb-6 space-y-4">
        <SharedFields
          formData={formData}
          handleChange={handleChange}
          region={region}
          setRegion={setRegion}
          type={type}
          setType={setType}
          after1947={after1947}
          setAfter1947={setAfter1947}
          isCommemorative={isCommemorative}
          setIsCommemorative={setIsCommemorative}
        />

        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
          🔍 Search
        </button>
      </form>

      {/* Display Results */}
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item, idx) => (
            <div key={idx} className="p-4 border rounded">
              <h3 className="font-bold">{item.denomination || item.coinValue} {item.currency}</h3>
              <p>{item.year} • {item.region}</p>
              <p>{item.issuer || item.mint || item.ruler}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
