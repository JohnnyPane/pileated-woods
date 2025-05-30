import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from "@mantine/carousel";
import { useDisclosure } from "@mantine/hooks";
import { Button, Image, Accordion, Modal } from "@mantine/core";
import './Products.scss';

import { productTypeDisplayName } from "../workshop/utils/productConfigs.js";
import { moneyDisplay } from "../../utils/humanizeText.js";
import { useCart } from "../../context/CartContext.jsx";
import { useIsAdminRoute } from "../../context/AdminRouteContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

import PileatedApi from "../../services/PileatedApi.js";
import ProductDetails from "./ProductDetails.jsx";
import NumberPlusMinusInput from "../ui/NumberPlusMinusInput.jsx";
import ProductForm from "../workshop/ProductForm.jsx";

const productApi = new PileatedApi('product');
const rootURL = import.meta.env.VITE_API_ROOT_URL;

function ProductShow({ providedProduct }) {
  const { id } = useParams();
  const [product, setProduct] = useState(providedProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [opened, { open, close }] = useDisclosure(false);

  const { isAdminUser } = useAuth();
  const { addToCart } = useCart();
  const isAdminRoute = useIsAdminRoute();

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

  const isInStock = product.stock > 0;
  const upperLimitMessage = product.stock > 1 ? `There are only ${product.stock} ${product.name}s in stock` : `There is only ${product.stock} ${product.name} in stock`;
  const stockDisplay = isInStock ? (
    <span className="product-detail-stock">
      <NumberPlusMinusInput onChange={setQuantity} value={quantity} min={1} max={product.stock} upperLimitMessage={upperLimitMessage} />
    </span>) : (<span className="product-detail-out-of-stock">Out of Stock</span>);

  const displayAdminComponents = isAdminUser && isAdminRoute;

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div>
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
          <h1 className="header-1">{product.name}</h1>
          <p className="sub-header-1">{productTypeDisplayName[product.productable_type]}</p>
          <Accordion defaultValue="description">
            <Accordion.Item key="description" value="description">
              <Accordion.Control value="description" className="accordion-panel-header">DESCRIPTION</Accordion.Control>
              <Accordion.Panel className="product-detail-description">{product.description}</Accordion.Panel>
            </Accordion.Item>

            <ProductDetails product={product} />
          </Accordion>

          <div className="product-detail-price">
            <span className="label-large padding-left">{moneyDisplay(product.price)}</span>
          </div>

          <div className="product-detail-action">
            {!displayAdminComponents && stockDisplay}
            {!isAdminRoute &&
              <Button
                onClick={() => addToCart(product, quantity)}
                radius="0"
                color="green"
                className="product-detail-add-to-cart"
                fullWidth
                disabled={!isInStock}
              >
                Add to cart
              </Button>
            }

            {displayAdminComponents &&
              <Button
                onClick={open}
                radius="0"
                color="pink"
                className="product-detail-add-to-cart"
                fullWidth
                disabled={!isInStock}
              >
                Edit Product
              </Button>
            }
          </div>
        </div>
      </div>

      {displayAdminComponents && <Modal opened={opened} onClose={close} size="auto">
        <ProductForm editMode={true} product={product} close={close} />
      </Modal>}
    </div>
  );
}

export default ProductShow;