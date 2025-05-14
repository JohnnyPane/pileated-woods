import { TextInput, NumberInput, Switch } from "@mantine/core";
import { getProductFormConfig } from "./utils/productConfigs.js";

const TextInputField = ({ label, placeholder, value, onChange }) => {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="margin-bottom"
    />
  );
}

const NumberInputField = ({ label, placeholder, value, onChange }) => {
  return (
    <NumberInput
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="margin-bottom"
    />
  );
}

const SwitchField = ({ label, checked, onChange }) => {
  return (
    <Switch
      label={label}
      checked={checked}
      onChange={onChange}
      className="margin-bottom"
    />
  );
}

const ProductFormFields = ({ productType, form }) => {
  const formFields = getProductFormConfig(productType);
  if (!formFields || formFields.length === 0) {
    return null;
  }

  return (
    <div>
      {formFields.map((field) => {
        const { label, placeholder, type, value } = field;
        const fieldValue = form.values.product[value];

        switch (type) {
          case 'text':
            return (
              <TextInputField
                key={value}
                label={label}
                placeholder={placeholder}
                value={fieldValue}
                onChange={(event) => form.setFieldValue(`product.productable_attributes.${value}`, event.currentTarget.value)}
              />
            );
          case 'number':
            return (
              <NumberInputField
                key={value}
                label={label}
                placeholder={placeholder}
                value={fieldValue}
                onChange={(value) => form.setFieldValue(`product.productable_attributes.${value}`, value)}
              />
            );
          case 'switch':
            return (
              <SwitchField
                key={value}
                label={label}
                checked={fieldValue}
                onChange={(event) => form.setFieldValue(`product.productable_attributes.${value}`, event.currentTarget.checked)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  )
}

export default ProductFormFields;