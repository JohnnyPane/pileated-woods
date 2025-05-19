import useCart from "../../context/CartContext";


const CartSummary = () => {
  const { cart, loading, cartTotal } = useCart();

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  const cartTotalDisplay = `$${cartTotal().toFixed(2)}`;

  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      <ul>
        {cart.items.map(item => (
          <li key={item.id}>
            {item.product.name} - ${item.product.price.toFixed(2)} x {item.quantity}
          </li>
        ))}
      </ul>
      <h4>Total: ${cartTotalDisplay}</h4>
    </div>
  );
}

export default CartSummary;