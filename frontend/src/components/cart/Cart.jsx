import { Link, useNavigate } from "react-router-dom";
import useCart from "../../context/CartContext";
import {Button} from "@mantine/core";

const Cart = () => {
  const { cart, loading, removeFromCart, updateQuantity, cartTotal } = useCart();

  const navigate = useNavigate();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {cart.items.map(cartItem => (
          <li key={cartItem.id}>
            <Link to={`/product/${cartItem.product_id}`}>{cartItem.product.name}</Link>
            {/*<span> - ${item.price.toFixed(2)}</span>*/}
            <input
              type="number"
              value={cartItem.quantity}
              onChange={(e) => updateQuantity(cartItem.id, e.target.value)}
            />
            <button onClick={() => removeFromCart(cartItem.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <h2>Total: ${cartTotal()}</h2>
      <Button onClick={() => navigate('/checkout')}>Go to Checkout</Button>
    </div>
  );
}

export default Cart;