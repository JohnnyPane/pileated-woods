import { Progress, Text } from "@mantine/core";
import { orderStatusConfig } from "../../utils/orderStatusConfig.js";
import React from "react";

const OrderStatusProgress = ({ order, size = "sm" }) => {
  const orderConfig = orderStatusConfig[order.status];

  return (
    <>
      <div className="flex row to-left margin-bottom">
        <Text c="dimmed" size="xs" fw={700} className="margin-right">
          Status:
        </Text>
        <Text fw={700} size="sm">
          {orderConfig.label}
        </Text>
      </div>
      <Progress
        value={orderConfig.progress}
        label={orderConfig.label}
        color={orderConfig.color}
        size={size}
        radius="xl"
      />
    </>
  );
}

export default OrderStatusProgress;