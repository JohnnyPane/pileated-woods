import CartItem from "../cart/CartItem.jsx";

const OrderDetails = ({ order }) => {
  if (!order) {
    return <div>Loading order...</div>;
  }

  const { order_items } = order;

  if (!order_items || order_items.length === 0) {
    return <div>Your order is empty.</div>;
  }

  return (
    <div className="double-padding">
      {order_items.map(cartItem => (
        <div key={cartItem.id} className="input-width margin-bottom">
          <CartItem item={cartItem} />
        </div>
      ))}
    </div>
  );
}

export default OrderDetails;