import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';


import PileatedApi from "../../services/PileatedApi.js";
import ProductDetails from "../products/ProductShow.jsx";
import ImageUploader from "../ui/ImageUploader.jsx";

const productApi = new PileatedApi('product');

const ProductWorkshop = () => {
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.get(id);
        setProduct(response);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImagesUploaded = (imageUrls) => {
    setProductImages([...productImages, ...imageUrls]);
  };

  if (!product) return <div className="loading">Loading product details...</div>;

  return (
    <div className="product-edit">
      <ProductDetails providedProduct={product} />

      <Modal opened={opened} onClose={close} title="Upload Images" centered size="xl">
        <div>
          <ImageUploader
            onUploadComplete={handleImagesUploaded}
            maxFiles={8}
            existingImages={productImages}
            modelType="product"
            modelId={product.id}
            multiple={true}
          />
        </div>
      </Modal>

      <Button onClick={open} variant="outline" color="blue">
        Upload Images
      </Button>
    </div>
  );
}

export default ProductWorkshop;