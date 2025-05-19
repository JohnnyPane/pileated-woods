import React, { useEffect, useState } from 'react';

import PileatedApi from "../../services/PileatedApi.js";
import OrderCard from "../orders/OrderCard.jsx";
import { SimpleGrid } from "@mantine/core";

const orderApi = new PileatedApi('order');

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderApi.query({ page: 1, per_page: 100 });
        console.log('Fetched orders:', response);
        setOrders(response);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Orders</h2>
      <SimpleGrid cols={4} spacing="xs" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        {orders.map(order => (
          <OrderCard order={order} key={order.id} />
        ))}
      </SimpleGrid>
    </div>
  );
}

export default Orders;