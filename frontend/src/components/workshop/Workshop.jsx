import { Modal, Button } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import ProductForm from "./ProductForm.jsx";
import ProductList from "../products/ProductList.jsx";

const Workshop = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <div className="flex-container flex-row space-between">
        <div>
          <h1>Workshop</h1>
          <p>Welcome to the workshop page!</p>
        </div>

        <Button onClick={open}>Add a Product</Button>
      </div>

      <ProductList />

      <Modal opened={opened} onClose={close} size="auto">
        <ProductForm />
      </Modal>
    </div>
  );
}

export default Workshop;