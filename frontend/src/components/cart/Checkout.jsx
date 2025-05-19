import { Grid, Fieldset } from "@mantine/core";

import CheckoutDetails from "./CheckoutDetails.jsx";
import Cart from "./Cart.jsx";

const Checkout = () => {
  return (
    <Grid>
      <Grid.Col span={6} md={6}>
        <Fieldset legend="Shipping & Billing" className="margin-bottom">
          <CheckoutDetails />
        </Fieldset>
      </Grid.Col>

      <Grid.Col span={6} md={6}>
        <Fieldset legend="Cart" className="margin-bottom">
          <Cart checkout={true} />
        </Fieldset>
      </Grid.Col>
    </Grid>
  );
}

export default Checkout;

