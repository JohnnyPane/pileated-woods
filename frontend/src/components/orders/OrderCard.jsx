import React, { useState } from 'react';
import { Card, Text, Select, Modal, Button } from '@mantine/core';
import { useDisclosure } from "@mantine/hooks";

import { useFlash } from "../../context/FlashContext.jsx";
import { humanizeRailsDate, moneyDisplay } from '../../utils/humanizeText.js';
import { orderStatusConfig } from "../../utils/orderStatusConfig.js";
import PileatedApi from "../../services/PileatedApi.js";
import OrderStatusProgress from "./OrderStatusProgress.jsx";

const orderApi = new PileatedApi('order');

const orderStatusMap = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  completed: 'Completed',
  canceled: 'Canceled',
}

const OrderCard = ({ order }) => {
  const [orderData, setOrderData] = useState(order);
  const [newStatus, setNewStatus] = useState(order.status);
  const [opened, { open, close }] = useDisclosure(false);
  const { showNotification } = useFlash();

  const orderConfig = orderStatusConfig[orderData.status];

  const updateOrderStatus = async () => {
    try {
      const response = await orderApi.update(order.id, { status: newStatus });
      if (response) {
        setOrderData(prevOrder => ({
          ...prevOrder,
          status: newStatus,
        }));
      }
      close();
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'Failed to update order status',
        color: 'red',
      });
      console.error('Error updating order status:', error);
    }
  }

  return (
    <Card shadow="xs" key={orderConfig.label}>
      <div className="flex row space-between margin-bottom">
        <Text c="dimmed" size="xs" fw={700} className="margin-right">
          Order ID:
        </Text>
        <Text fw={700} size="sm">
          {order.id}
        </Text>
      </div>

      <div className="flex row space-between margin-bottom">
        <Text c="dimmed" size="xs" fw={700} className="margin-right">
          Order Date:
        </Text>
        <Text fw={700} size="sm">
          {humanizeRailsDate(order.created_at)}
        </Text>
      </div>

      <div className="flex row space-between margin-bottom">
        <Text c="dimmed" size="xs" fw={700} className="margin-right">
          Total Amount:
        </Text>
        <Text fw={700} size="sm">
          {moneyDisplay(order.total_amount)}
        </Text>
      </div>

      <div className="flex to-top column full-width margin-bottom">
        <div className="flex row space-between full-width">
          <Text c="dimmed" size="xs" fw={700}>
            Order Status:
          </Text>
          <Text fw={700} size="sm" c={orderConfig.color}>
            {orderConfig.label}
          </Text>
        </div>
      </div>

      <OrderStatusProgress order={order} size="lg" />

      <div className="flex to-top column full-height margin-bottom margin-top">
        <Text c="dimmed" size="xs" fw={700}>
          Shipping Address
        </Text>
        <Text fw={700} size="sm">
          {order.shipping_address}
        </Text>
      </div>

      <Select
        label="Update Order Status"
        placeholder="Select status"
        data={Object.keys(orderStatusMap).map(key => ({
          value: key,
          label: orderStatusMap[key],
        }))}
        value={orderData.status}
        onChange={(value) => {
          setNewStatus(value);
          open();
        }}
      />

      <Modal
        opened={opened}
        onClose={close}
        title="Order Details"
        size="lg"
        >
        <Text size="lg" weight={500} mb="md" >
          Are you sure you want to update the order status from {orderData.status} to {newStatus}?
        </Text>

        <div className="flex row margin-t-80 margin-bottom to-right">
          <Button onClick={close} variant="outline" color={"red"} className="margin-right">No, cancel</Button>
          <Button onClick={updateOrderStatus} variant="outline" color={"green"}>Yes, update status</Button>
        </div>
      </Modal>

    </Card>
  );
}

export default OrderCard;