import { useNavigate } from "react-router-dom";
import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Button, Group, Card, Text } from '@mantine/core';

import { useAuth } from "../../context/AuthContext.jsx";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters long'),
    },
  });

  const handleSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="login-signup-form">
      <Text size="lg" weight={500}>
        Welcome back!
      </Text>
      <Text size="sm" color="dimmed" mb="lg">
        Please log in to your account.
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          {...form.getInputProps('email')}
          className="margin-bottom"
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          {...form.getInputProps('password')}
          className="margin-bottom"
        />
        <Group position="apart" mt="lg">
          <Button type="submit">Log In</Button>
        </Group>
      </form>
    </Card>
  );
}

export default LoginForm;