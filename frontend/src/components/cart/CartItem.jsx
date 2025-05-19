import { Link } from "react-router-dom";
import { Image } from "@mantine/core";

import { productTypeDisplayName } from "../workshop/utils/productConfigs.js";
const rootURL = import.meta.env.VITE_API_ROOT_URL;


const CartItem = ({ item, onRemove, close }) => {
  const { product } = item;

  const handleRemove = () => {
    onRemove(item.id);
  };

  const imageUrl = product.cart_image_urls.length > 0 ? rootURL + product.cart_image_urls[0] : '';

  return (
    <div className="flex-container flex-row align-left to-left">
      <Link to={`/products/${item.product_id}`} className="link-label" onClick={close}>
        <Image src={imageUrl} alt={product.name} style={{ width: "100px"}} fit="contain" className="double-margin-right" />
      </Link>

      <div className="flex-container flex-row space-between full-width to-top">
        <div className="flex-container align-left flex-column">
          <span>{product.name}</span>
          <span className="italic label-header">{productTypeDisplayName[product.productable_type]}</span>
        </div>

        <div className="bold label">
          <span>${product.price.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
}

export default CartItem;