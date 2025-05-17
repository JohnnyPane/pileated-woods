import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from "@mantine/carousel";
import { Button, Image } from "@mantine/core";
import './Products.scss';

import { useCart } from "../../context/CartContext.jsx";
import PileatedApi from "../../services/PileatedApi.js";
import ProductDetails from "./ProductDetails.jsx";

const productApi = new PileatedApi('product');
const rootURL = import.meta.env.VITE_API_ROOT_URL;

function ProductShow({ providedProduct }) {
  const { id } = useParams();
  const [product, setProduct] = useState(providedProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productApi.get(id);
      setProduct(response);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch product details');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {

    if (!providedProduct || providedProduct.id != id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  const slides  = product.images.map((image, index) => (
    <Carousel.Slide key={index}>
      <Image
        src={rootURL + image}
        alt={product.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 8,
        }}
      />
    </Carousel.Slide>
  ));

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div >
          {product.images && product.images.length > 0 ? (
            <Carousel
              slideSize="100%"
              slideGap="md"
              align="start"
              loop
              withIndicators
              height={500}
              styles={{
                viewport: {
                  maxWidth: 400,
                  margin: '0 auto',
                },
              }}
            >
              {slides}
            </Carousel>
          ) : (
            <div className="product-detail-image-placeholder">No image available</div>
          )}
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-price">${product.price}</p>
          <p className="product-detail-description">{product.description}</p>

          <ProductDetails product={product} />

          {product.stock > 0 ? (
            <div className="product-detail-action">
              <Button onClick={() => addToCart(product)} radius="md" color="green">Add to cart</Button>
              <span className="product-detail-stock">
                {product.stock} {product.stock === 1 ? 'item' : 'items'} in stock
              </span>
            </div>
          ) : (
            <div className="product-detail-out-of-stock">
              <span>Out of Stock</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProductShow;