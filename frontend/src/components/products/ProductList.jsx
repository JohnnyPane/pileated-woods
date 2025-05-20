import { useState, useEffect } from 'react';

import PileatedApi from "../../services/PileatedApi.js";
import './Products.scss';
import ProductCard from "./ProductCard.jsx";

const productApi = new PileatedApi('product');

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.query();
        setProducts(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      <div className="product-grid">
        {products.map(product => (
          <ProductCard cardData={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;