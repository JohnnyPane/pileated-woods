
import { Button, Card, Group, Image, Text } from '@mantine/core';

import { humanizeProductType } from "../../utils/humanizeText.js";
import { useCart } from "../../context/CartContext.jsx";

const rootURL = import.meta.env.VITE_API_ROOT_URL;

const ProductCard = ({ cardData }) => {
  const { images, name, description, productable_type, price } = cardData;
  const { addToCart } = useCart();

  const productTypeText = humanizeProductType(productable_type);

  return (
    <Card shadow="sm" padding="lg" radius="8px" withBorder={true}>
      <Card.Section>
        {images && images.length > 0 ? (
          <Image
            src={rootURL + images[0]}
            alt={name}
            className="product-image"
          />
        ) : (
          <div className="product-image-placeholder">No image</div>
        )}
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} fz="lg">
          {name}
        </Text>

        <Group gap={5}>
          <Text fz="sm" fw={600}>
            {productTypeText}
          </Text>
        </Group>
      </Group>

      <Text fz="sm" c="dimmed" mt="sm">
        {description}
      </Text>

      <Group justify="space-between" mt="md">
        <div>
          <Text fz="xl" span fw={500} className="">
            {price}
          </Text>
        </div>

        <Button onClick={() => addToCart(cardData)} radius="md">Add to cart</Button>
      </Group>
    </Card>
  );
}

export default ProductCard;