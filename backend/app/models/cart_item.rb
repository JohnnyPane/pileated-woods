class CartItem < ApplicationRecord
  belongs_to :cart
  belongs_to :product

  validates :quantity, numericality: { greater_than: 0 }
  validates :cart_id, uniqueness: { scope: :product_id }

  def subtotal
    product.price * quantity
  end
end
