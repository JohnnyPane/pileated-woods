import useCart from "../../context/CartContext";
import { moneyDisplay } from "../../utils/humanizeText.js";


const CartSummary = () => {
  const { cart, loading, cartTotalDisplay } = useCart();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      <ul>
        {cart.items.map(item => (
          <li key={item.id}>
            {item.product.name} - {moneyDisplay(item.product.price)} x {item.quantity}
          </li>
        ))}
      </ul>
      <h4>Total: ${cartTotalDisplay}</h4>
    </div>
  );
}

export default CartSummary;