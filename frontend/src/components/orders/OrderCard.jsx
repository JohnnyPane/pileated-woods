import { Card, Group, RingProgress, Text } from '@mantine/core';

const statusStats = {
  pending: { label: 'Pending', progress: 25, color: 'yellow' },
  processing: { label: 'Processing', progress: 50, color: 'blue' },
  shipped: { label: 'Shipped', progress: 75, color: 'orange' },
  completed: { label: 'Completed', progress: 100, color: 'green' },
  canceled: { label: 'Canceled', progress: 100, color: 'red'},
}

const OrderCard = ({ order }) => {

  const orderStats = statusStats[order.status];


  return (
    <Card withBorder radius="md" p="xs" key={orderStats.label}>
      <Card.Section>
        <div className="flex-container flex-row to-left">
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: orderStats.progress, color: orderStats.color }]}
          />

          <div>
            <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
              Order ID: {order.id}
            </Text>
            <Text fw={700} size="sm">
              {orderStats.label}
            </Text>
          </div>

        </div>
      </Card.Section>

      <div className="flex-container flex-row to-left">
        <div className="flex-container to-top flex-column full-height">
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            Shipping Address
          </Text>
          <Text fw={700} size="sm">
            {order.shipping_address}
          </Text>
        </div>
      </div>
    </Card>
  );
}

export default OrderCard;