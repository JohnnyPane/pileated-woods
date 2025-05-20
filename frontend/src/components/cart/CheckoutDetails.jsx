import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Button, Grid } from "@mantine/core";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import PileatedApi from "../../services/PileatedApi.js";
import FormInput from "../ui/FormInput.jsx";

const orderApi = new PileatedApi('order');

const formInputs = [
  { name: 'customer_name', label: 'Name', type: 'text', required: true },
  { name: 'customer_email', label: 'Email', type: 'text', required: true, gridSize: 6 },
  { name: 'phone', label: 'Phone', type: 'text', required: false, gridSize: 6 },
  { name: 'shipping_address.address_1', label: 'Shipping Address', type: 'text', required: true },
  { name: 'shipping_address.address_2', label: 'Address Line 2', type: 'text', required: false, gridSize: 6 },
  { name: 'shipping_address.city', label: 'City', type: 'text', required: true, gridSize: 6  },
  { name: 'shipping_address.state', label: 'State', type: 'text', required: true, gridSize: 6  },
  { name: 'shipping_address.zip', label: 'Zip Code', type: 'text', required: true, gridSize: 6  },
  // { name: 'shipping_address.country', label: 'Country', type: 'text', required: true },
  { name: 'billing_address.address_1', label: 'Billing Address', type: 'text', required: false, isBilling: true },
  { name: 'billing_address.address_2', label: 'Address Line 2', type: 'text', required: false, isBilling: true, gridSize: 6 },
  { name: 'billing_address.city', label: 'City', type: 'text', required: false, isBilling: true, gridSize: 6  },
  { name: 'billing_address.state', label: 'State', type: 'text', required: false, isBilling: true, gridSize: 6  },
  { name: 'billing_address.zip', label: 'Zip Code', type: 'text', required: false, isBilling: true, gridSize: 6  },
  // { name: 'billing_address.country', label: 'Country', type: 'text', required: false, isBilling: true },
  { name: 'billing_same_as_shipping', label: 'Billing same as shipping', type: 'checkbox', required: false },
];

const CheckoutDetails = () => {
  const { cart, loading, clearCart, cartTotalDisplay } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const form = useForm({
    initialValues: {
      customer_name: '',
      customer_email: '',
      phone: '',
      shipping_address: {
        address_1: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      },
      billing_address: {
        address_1: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      },
      billing_same_as_shipping: true,
    },
    validate: {
      customer_name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      customer_email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (value.length < 10 ? 'Phone number must be at least 10 digits' : null),
      shipping_address: {
        line1: (value) => (value.length < 5 ? 'Address must be at least 5 characters' : null),
        city: (value) => (value.length < 2 ? 'City must be at least 2 characters' : null),
        state: (value) => (value.length < 2 ? 'State must be at least 2 characters' : null),
        zip: (value) => (/\d{5}/.test(value) ? null : 'Invalid postal code'),
        country: (value) => (value.length < 2 ? 'Country must be at least 2 characters' : null),
      },
    },
  });

  const billingSameAsShipping = form.getInputProps('billing_same_as_shipping').value;

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      form.setFieldValue('customer_name', currentUser.name);
      form.setFieldValue('customer_email', currentUser.email);
      form.setFieldValue('phone', currentUser.phone || '');
      form.setFieldValue('shipping_address.line1', currentUser.shipping_address?.address_1 || '');
      form.setFieldValue('shipping_address.city', currentUser.shipping_address?.city || '');
      form.setFieldValue('shipping_address.state', currentUser.shipping_address?.state || '');
      form.setFieldValue('shipping_address.zip', currentUser.shipping_address?.postal_code || '');
      form.setFieldValue('shipping_address.country', currentUser.shipping_address?.country || '');
    }
  }, [isAuthenticated, currentUser]);

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty. <Link to="/">Continue Shopping</Link></div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const { customer_name, customer_email, phone, shipping_address, billing_address, billing_same_as_shipping } = form.values;

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: customer_name,
          email: customer_email,
          address: {
            line1: shipping_address.address_1,
            city: shipping_address.city,
            state: shipping_address.state,
            postal_code: shipping_address.zip,
            country: 'US',
          },
        },
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      const response = await orderApi.create({
        payment_method: paymentMethod.id,
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone_number: phone,
        shipping_address_attributes: shipping_address,
        billing_address_attributes: billing_address,
        billing_same_as_shipping: billing_same_as_shipping,
      });

      clearCart();
      navigate(`/orders/${response.id}`, { replace: true });
    } catch (error) {
      setError("An error occurred while processing your order. Please try again.");
      setProcessing(false);
      console.error("Checkout error:", error);
    }
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <Grid>
          {
            formInputs.map((input) => {
              const { name, label, type, required } = input;
              return (
                <Grid.Col key={name} span={{ base: 12, sm: input.gridSize || 12 }}>
                  <FormInput
                    key={name}
                    label={label}
                    placeholder={label}
                    required={required}
                    type={type}
                    value={form.values[name]}
                    {...form.getInputProps(name, { type: type })}
                    error={form.errors[name]}
                    hidden={input.isBilling && billingSameAsShipping}
                  />
                </Grid.Col>
              )
            })
          }
        </Grid>


        <div className="margin-40-t">
          <CardElement />
        </div>

        {error && <div className="error">{error}</div>}
        <Button type="submit" color="violet" disabled={!stripe || !elements || processing} className="margin-40-t full-width">
          {processing ? "Processing..." : `Pay $${cartTotalDisplay}`}
        </Button>
      </form>

      <div className="margin-40-t">
        <Link to="/">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default CheckoutDetails;