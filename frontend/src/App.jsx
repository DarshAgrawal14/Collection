// App.jsx - Main application file
import React from 'react';
import InventoryForm from './components/inventoryForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Numismatic Collection Manager</h1>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6">
        <InventoryForm />
      </main>
      
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Numismatic Collection Manager
        </div>
      </footer>
    </div>
  );
}

export default App;