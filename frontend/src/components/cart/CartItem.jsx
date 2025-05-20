import { Link } from "react-router-dom";
import { Image } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

import { productTypeDisplayName } from "../workshop/utils/productConfigs.js";
import { moneyDisplay } from "../../utils/humanizeText.js";

const rootURL = import.meta.env.VITE_API_ROOT_URL;


const CartItem = ({ item, onRemove, close }) => {
  const { product } = item;

  const handleRemove = () => {
    onRemove(item.id);
  };

  const imageUrl = product.cart_image_urls.length > 0 ? rootURL + product.cart_image_urls[0] : '';

  return (
    <div className="flex row align-left to-left cart-item">
      <Link to={`/products/${item.product_id}`} className="link-label" onClick={close}>
        <Image src={imageUrl} alt={product.name} style={{ width: "100px"}} fit="contain" className="double-margin-right" />
      </Link>

      <div className="flex column full-width to-top">
          <span>{product.name}</span>
          <span className="italic label-large">{productTypeDisplayName[product.productable_type]}</span>
      </div>

      <div className="flex column full-height space-between align-right">
        <span className="bold label">{moneyDisplay(product.price)}</span>
        <IconTrash onClick={handleRemove} size={20} className=" clickable" color="red"/>
      </div>
    </div>
  );
}

export default CartItem;