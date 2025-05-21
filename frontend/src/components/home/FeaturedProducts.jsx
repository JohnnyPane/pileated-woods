import { useEffect, useState } from "react";
import PileatedApi from "../../services/PileatedApi.js";
import FeaturedProduct from "./FeaturedProduct.jsx";

const productApi = new PileatedApi('product');

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.query({ scopes: [{ name: 'featured' }] });
        setProducts(response);
        console.log(response, "response");
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return <div>No featured products available.</div>;
  }

  return (
    <div className="featured-products">
      {products.map((product, index) => (
        <FeaturedProduct product={product} key={product.id} index={index} />
      ))}
    </div>
  );
}

export default FeaturedProducts;