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
      <h1>Our Handcrafted Wooden Products</h1>
      <div className="product-grid">
        {products.map(product => (
          // <Link to={`/products/${product.id}`} key={product.id} className="product-card">
            <ProductCard cardData={product} key={product.id} />
          // </Link>
          // <Link to={`/products/${product.id}`} key={product.id} className="product-card">
          //   {product.images && product.images.length > 0 ? (
          //     <img
          //       src={`/images/${product.images[0].url}`}
          //       alt={product.name}
          //       className="product-image"
          //     />
          //   ) : (
          //     <div className="product-image-placeholder">No image</div>
          //   )}
          //   <div className="product-info">
          //     <h3>{product.name}</h3>
          //     <p className="product-price">${product.price}</p>
          //     <p className="product-type">{product.productable_type}</p>
          //     {product.stock <= 3 && product.stock > 0 && (
          //       <p className="product-low-stock">Only {product.stock} left!</p>
          //     )}
          //     {product.stock === 0 && (
          //       <p className="product-out-of-stock">Out of stock</p>
          //     )}
          //   </div>
          // </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;