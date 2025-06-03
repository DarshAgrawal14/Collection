// App.jsx - Main application file
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InventoryForm from './components/inventoryForm';
import SearchPage from './components/SearchPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Numismatic Collection Manager</h1>
            <div className="flex gap-4 text-sm">
              <Link to="/" className="hover:underline">➕ Add Item</Link>
              <Link to="/search" className="hover:underline">🔍 Search</Link>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<InventoryForm />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/update/:id" element={<InventoryForm />} /> {/* 👈 Add this */}
          </Routes>
        </main>
        
        <footer className="mt-12 py-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Numismatic Collection Manager
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
