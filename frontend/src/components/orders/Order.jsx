import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";

import { moneyDisplay, humanizeRailsDate } from "../../utils/humanizeText.js";
import OrderEmailCheck from "./OrderEmailCheck.jsx";
import PileatedApi from "../../services/PileatedApi.js";
import OrderDetails from "./OrderDetails.jsx";
import OrderStatusProgress from "./OrderStatusProgress.jsx";
import {Text} from "@mantine/core";

const orderApi = new PileatedApi('order');

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailMatches, setEmailMatches] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderApi.get(orderId);
        console.log("Order response:", response);
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

  if (!emailMatches) {
    return (
      <div>
        <h1>Order Verification</h1>
        <p>Please verify your email to view order details.</p>
        <OrderEmailCheck order={order} setEmailMatches={setEmailMatches} />
      </div>
    );
  }

  return (
    <div className="flex column align-left">
      <h2 className="margin-none">Order #{order.id} Details</h2>

      <div className="flex row margin-bottom">
        <Text c="dimmed" size="xs" fw={700} className="margin-right">
          Order ID:
        </Text>
        <Text fw={700} size="sm">
          {order.id}
        </Text>
      </div>

      <div className="input-width margin-bottom">
        <OrderStatusProgress order={order}/>
      </div>

      <div className="flex row margin-bottom ">
        <Text c="dimmed" size="xs" fw={700} className="margin-right">
          Created:
        </Text>
        <Text fw={700} size="sm">
          {humanizeRailsDate(order.created_at)}
        </Text>
      </div>

      <div className="flex row margin-bottom">
        <Text c="dimmed" size="xs" fw={700} className="margin-right">
          Shipping Address:
        </Text>
        <Text fw={700} size="sm">
          {order.shipping_address.full_address}
        </Text>
      </div>

      <h2 className="margin-none">Items</h2>
      <OrderDetails order={order}/>
      <p>Total Cost: {moneyDisplay(order.total_amount)}</p>
      <Link to="/">Continue Shopping</Link>
    </div>
  );
}

export default Order;