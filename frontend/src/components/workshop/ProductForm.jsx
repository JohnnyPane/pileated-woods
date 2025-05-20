import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Group, Select, Grid, Fieldset } from '@mantine/core';
import { useForm } from '@mantine/form';
import './ProductForm.scss'

import PileatedApi from "../../services/PileatedApi.js";
import ProductFormFields from "./ProductFormFields.jsx";
import FormInput from "../ui/FormInput.jsx";

const productApi = new PileatedApi('product');

const productTypes = [
  { value: '', label: 'Select a product type' },
  { value: 'LiveEdgeSlab', label: 'Live Edge Slab' },
  { value: 'CustomProduct', label: 'Custom Product' },
];

const productInputs = [
  { name: 'name', label: 'Name', type: 'text', value: 'product.name' },
  { name: 'description', label: 'Description', type: 'textarea', value: 'product.description' },
  { name: 'price', label: 'Price', type: 'number', value: 'product.price', description: 'ENTER PRICE IN CENTS' },
  { name: 'stock', label: 'Stock', type: 'number', value: 'product.stock' },
  { name: 'featured', label: 'Featured', type: 'checkbox', value: 'product.featured' },
]

const findProductType = (value) => {
  return productTypes.find(type => type.value === value);
}

const ProductForm = ({ editMode = false, product = null, close = () => {} }) => {
  const [productType, setProductType] = useState(product ? findProductType(product.productable_type) : '');
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      product: {
        name: product ? product.name : '',
        description: product ? product.description : '',
        price: product ? product.price : 0,
        featured: product ? product.featured : false,
        stock: product ? product.stock : 0,
        productable_type: product ? product.productable_type : '',
        productable_attributes: product ? product.productable : {},
      },
    },
    validate: {
      product: {
        name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
        description: (value) => (value.length < 10 ? 'Description must be at least 10 characters' : null),
        price: (value) => (value <= 0 ? 'Price must be greater than zero' : null),
        stock: (value) => (value < 0 ? 'Stock cannot be negative' : null)
      }
    }
  });

  const onCreate = async (values) => {
    try {
      const response = await productApi.create(values.product);
      navigate(`/workshop/products/${response.id}`);
      close();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  }

  const onUpdate = async (values) => {
    try {
      const response = await productApi.update(product.id, values.product);
      navigate(`/workshop/products/${response.id}`);
      close();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  }

  const onSubmit = async (values) => {
    if (editMode) {
      await onUpdate(values);
    } else {
      await onCreate(values);
    }
  }

  const handleProductTypeChange = (value) => {
    const productableType = findProductType(value);
    if (productableType) {
      form.setFieldValue('product.productable_type', productableType.value);
      form.setFieldValue('product.productable', {});
      setProductType(productableType);
    }
  }

  const productFieldSetLabel = productType ? `${productType.label} Information` : 'Additional Information';

  return (
    // <Card shadow="sm" padding="lg" radius="md" withBorder className="product-card">
    <div className="product-form">
      <h2>{editMode ? 'Edit Product' : 'Create Product'}</h2>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Select
          label="Product Type"
          placeholder="Select a product type"
          data={productTypes}
          onChange={handleProductTypeChange}
          className="margin-bottom"
          defaultValue={product ? product.productable_type : ''}
        />

        <Grid>
          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Fieldset legend="Product Information">
              {productInputs.map((input) => (
                <FormInput
                  key={input.name}
                  label={input.label}
                  placeholder={input.label}
                  required
                  type={input.type}
                  {...form.getInputProps(`product.${input.name}`, { type: 'type' })}
                  error={form.errors[input.name]}
                  description={input.description || ''}
                />
              ))}
            </Fieldset>
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 6 }}>
            <Fieldset legend={productFieldSetLabel}>
              <ProductFormFields productType={productType?.value} form={form} />
            </Fieldset>
          </Grid.Col>
        </Grid>

        <Group position="right" mt="md">
          <Button type="submit">{editMode ? "Update" : "Create"}</Button>
        </Group>

      </form>
    </div>
  );
};

export default ProductForm;