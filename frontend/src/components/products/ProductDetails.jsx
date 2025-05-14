import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Products.scss';

import pileatedApi from "../../services/pileatedApi.js";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await pileatedApi.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  // Render product details based on type
  const renderProductSpecifics = () => {
    if (!product.productable) return null;

    switch (product.productable_type) {
      case 'LiveEdgeSlab':
        return (
          <div className="product-specifics">
            <h3>Live Edge Details</h3>
            <p><strong>Material:</strong> {product.productable.species}</p>
            <p><strong>Length:</strong> {product.productable.length}</p>
            <p><strong>Width:</strong> {product.productable.width}</p>
            <p><strong>Height:</strong> {product.productable.height}</p>
            <p><strong>Dried:</strong> {product.productable.dried}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-detail-images">
          {product.images && product.images.length > 0 ? (
            <img
              src={`/images/${product.images[0].url}`}
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <div className="product-detail-image-placeholder">No image available</div>
          )}
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price}</p>
          <p className="product-detail-description">{product.description}</p>

          {product.stock > 0 ? (
            <div className="product-detail-action">
              <button className="button button-primary">Add to Cart</button>
              <span className="product-detail-stock">
                {product.stock} {product.stock === 1 ? 'item' : 'items'} in stock
              </span>
            </div>
          ) : (
            <div className="product-detail-out-of-stock">
              <span>Out of Stock</span>
            </div>
          )}

          {renderProductSpecifics()}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;