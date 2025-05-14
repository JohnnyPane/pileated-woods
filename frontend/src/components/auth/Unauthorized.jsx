import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-bold mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
          Administrator privileges are required.
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Products
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;