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
      defaultValue={value}
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
      defaultValue={value}
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
      defaultChecked={checked}
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
        const fieldValue = form.values.product.productable_attributes[value] || '';

        switch (type) {
          case 'text':
            return (
              <TextInputField
                key={value}
                label={label}
                placeholder={placeholder}
                value={fieldValue}
                onChange={(event) => form.setFieldValue(`product.productable_attributes.${value}`, event.currentTarget.value)}
                defaultValue={fieldValue}
              />
            );
          case 'number':
            return (
              <NumberInputField
                key={value}
                label={label}
                placeholder={placeholder}
                value={fieldValue}
                onChange={(eventValue) => form.setFieldValue(`product.productable_attributes.${value}`, eventValue)}
                defaultValue={fieldValue}
              />
            );
          case 'switch':
            return (
              <SwitchField
                key={value}
                label={label}
                checked={fieldValue}
                onChange={(event) => form.setFieldValue(`product.productable_attributes.${value}`, event.currentTarget.checked)}
                defaultChecked={fieldValue}
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