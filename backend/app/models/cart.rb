class Cart < ApplicationRecord
  belongs_to :user, optional: true
  has_many :cart_items, dependent: :destroy
  has_many :products, through: :cart_items

  validates :guest_token, uniqueness: true, allow_nil: true

  def total_price
    cart_items.includes(:product).sum do |cart_item|
      cart_item.product.price * cart_item.quantity
    end
  end


  def add_item(product_id, quantity = 1)
    product = Product.find(product_id)
    return false unless product && product.stock >= quantity

    cart_item = cart_items.find_or_initialize_by(product_id: product_id)
    cart_item.quantity = quantity
    cart_item.save
  end

  def transfer_to(user_cart)
    transaction do
      cart_items.each do |item|
        existing_item = user_cart.cart_items.find_by(product_id: item.product_id)

        if existing_item
          existing_item.increment!(:quantity, item.quantity)
        else
          item.update(cart_id: user_cart.id)
        end
      end

      reload
      destroy if cart_items.empty?
    end
  end
end
