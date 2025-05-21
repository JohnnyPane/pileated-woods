import { useNavigate } from "react-router-dom";
import { Image, Grid, Button } from '@mantine/core';
import { setImageUrl } from "../../utils/imageConfig.js";
import { productTypeDisplayName } from "../workshop/utils/productConfigs.js";

const FeaturedProduct = ({ product, index }) => {
  const navigate = useNavigate();

  const isEven = index % 2 === 0;

  const onBuyClick = () => {
    navigate(`/products/${product.id}`);
  }

  return (
    <div className="featured-product">
      <Grid>
        <Grid.Col span={6} order={isEven ? 1 : 2}>
          <div className="flex column full-height horizontal-center featured-product-description">
            <h1 className="non-bold">{product.name}</h1>
            <p className="label">{productTypeDisplayName[product.productable_type]}</p>
            <p>{product.description}</p>
            <Button variant="subtle" color="dark" onClick={onBuyClick}>Buy Now</Button>
          </div>
        </Grid.Col>

        <Grid.Col span={6} order={isEven ? 2 : 1}>
          <div className="flex horizontal-center">
            <Image
              className="featured-product-image"
              src={setImageUrl(product.images[0])}
              alt={product.name}
              style={{ maxWidth: '80%', height: 'auto' }}
            />
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
}

export default FeaturedProduct;