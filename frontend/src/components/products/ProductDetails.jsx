import { Accordion } from "@mantine/core";

const ProductDetails = ({ product }) => {
  if (!product) return null;

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
    <Accordion defaultValue={product.id}>
      <Accordion.Item key="details" value="details">
        <Accordion.Control>{product.name + " Details"}</Accordion.Control>
        <Accordion.Panel>{renderProductSpecifics()}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default ProductDetails;