import { Accordion } from "@mantine/core";

const ProductDetails = ({ product }) => {
  if (!product) return null;

  const renderProductSpecifics = () => {
    if (!product.productable) return null;

    switch (product.productable_type) {
      case 'LiveEdgeSlab':
        return (
          <div className="product-specifics">
            <p>Material: {product.productable.species}</p>
            <p>Length: {product.productable.length}"</p>
            <p>Width: {product.productable.width}"</p>
            <p>Height: {product.productable.height}"</p>
            <p>{product.productable.dried ? "Dried" : "Raw"}</p>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <Accordion defaultValue={product.id}>
      <Accordion.Item key="details" value="details">
        <Accordion.Control className="accordion-panel-header">DETAILS</Accordion.Control>
        <Accordion.Panel className="product-detail-description">{renderProductSpecifics()}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default ProductDetails;