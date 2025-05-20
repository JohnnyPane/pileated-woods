import { useState } from 'react';
import { Input, Button } from "@mantine/core";

const OrderEmailCheck = ({ order, setEmailMatches }) => {
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
    setEmailError(false);
  };

  const handleEmailCheck = () => {
    if (emailInput === order.customer_email) {
      setEmailMatches(true);
    } else {
      setEmailError(true);
    }
  };

  return (
    <div>
      <h2>Order Email Verification</h2>
      <div className="input-width">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={emailInput}
          onChange={handleEmailChange}
          error={emailError ? 'Email does not match order' : null}
        />
        <Button onClick={handleEmailCheck} className="margin-top">Verify Email</Button>
      </div>
      {emailError && <p style={{ color: 'red' }}>Emails do not match. Please try again.</p>}
    </div>
  );
}

export default OrderEmailCheck;