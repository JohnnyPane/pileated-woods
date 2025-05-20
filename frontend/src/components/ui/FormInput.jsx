import { TextInput, Checkbox, Textarea, NumberInput } from "@mantine/core";

const FormInput = ({ label, placeholder, required, type, value, onChange, error, hidden = false, small = false, description }) => {
  const formComponent = formInputDelegator[type];

  if (!formComponent) {
    return null;
  }

  if (hidden) {
    return null;
  }

  const className = small ? "small-input" : "";

  return formComponent({
    label,
    placeholder,
    required,
    type,
    value,
    onChange,
    error,
    description,
    className,
  });
}

const TextInputField = ({ label, description, placeholder, required, type, value, onChange, error, ...rest }) => {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      description={description}
      {...rest}
    />
  );
}

const TextareaField = ({ label, placeholder, required, value, onChange, error, ...rest }) => {
  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      error={error}
      {...rest}
    />
  );
}

const NumberInputField = ({ label, placeholder, required, value, onChange, error, ...rest }) => {
  return (
    <NumberInput
      label={label}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      error={error}
      {...rest}
    />
  );
}

const CheckboxField = ({ label, checked, onChange }) => {
  return (
    <Checkbox
      label={label}
      checked={checked}
      onChange={onChange}
      className="margin-top"
    />
  );
}

const formInputDelegator = {
  text: TextInputField,
  checkbox: CheckboxField,
  textarea: TextareaField,
  number: NumberInputField,
};

export default FormInput;