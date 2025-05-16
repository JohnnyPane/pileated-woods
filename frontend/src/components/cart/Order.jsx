import { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";

import PileatedApi from "../../services/PileatedApi.js";

const orderApi = new PileatedApi('order');

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderApi.get(orderId);
        setOrder(response);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <div>Loading order...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <h2>Items</h2>
      <ul>
        {order.order_items.map(item => (
          <li key={item.id}>
            {item.product.name} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      <Link to="/">Continue Shopping</Link>
    </div>
  );
}

export default Order;