import { TextInput, Checkbox } from "@mantine/core";

const FormInput = ({ label, placeholder, required, type, value, onChange, error, hidden = false }) => {
  const formComponent = formInputDelegator[type];

  if (!formComponent) {
    console.error(`Unsupported input type: ${type}`);
    return null;
  }

  if (hidden) {
    return null;
  }

  return formComponent({
    label,
    placeholder,
    required,
    type,
    value,
    onChange,
    error
  });
}

const TextInputField = ({ label, placeholder, required, type, value, onChange, error }) => {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
}

const CheckboxField = ({ label, checked, onChange }) => {
  return (
    <Checkbox
      label={label}
      checked={checked}
      onChange={onChange}
    />
  );
}

const formInputDelegator = {
  text: TextInputField,
  checkbox: CheckboxField,
};

export default FormInput;