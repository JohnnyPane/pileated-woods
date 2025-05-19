class OrderSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :user_id, :status, :total_amount, :customer_name, :customer_email, :created_at, :updated_at

  attribute :order_items do |object|
    object.order_items.map do |item|
      {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }
    end
  end

  attribute :shipping_address do |object|
    object.shipping_address&.full_address
  end
end