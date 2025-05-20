import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Image } from "@mantine/core";

import { humanizeProductType, moneyDisplay } from "../../utils/humanizeText.js";
import { useIsAdminRoute} from "../../context/AdminRouteContext.jsx";

const rootURL = import.meta.env.VITE_API_ROOT_URL;

const ProductCard = ({ cardData }) => {
  const { images, name, productable_type, price } = cardData;
  const [displayImageUrl, setDisplayImageUrl] = useState(images[0]);

  const isAdminRoute = useIsAdminRoute();
  const navigate = useNavigate();

  const productTypeText = humanizeProductType(productable_type);
  const handleCardClick = () => {
    if (isAdminRoute) {
      navigate(`/workshop/products/${cardData.id}`);
    } else {
      navigate(`/products/${cardData.id}`);
    }
  }

  const handleCardEnter = () => {
    if (images.length > 1) {
      setDisplayImageUrl(images[1]);
    }
  }

  const handleCardLeave = () => {
    setDisplayImageUrl(images[0]);
  }

  return (
    <div className="clickable" onClick={handleCardClick}>
      <div onMouseEnter={handleCardEnter} onMouseLeave={handleCardLeave}>
        <Image
          src={rootURL + displayImageUrl}
          alt={name}
          className="product-image margin-bottom"
        />
      </div>

      <div className="flex row space-between">
        <span>{name}</span>
        <span className="bold">{moneyDisplay(price)}</span>
      </div>

      <div className="italic saddle-brown">{productTypeText}</div>
    </div>
  );
}

export default ProductCard;