class Order < ApplicationRecord
  belongs_to :user, optional: true
  has_many :order_items, dependent: :destroy
  has_many :products, through: :order_items
  has_one :billing_address, -> { where(address_type: 'billing') }, as: :addressable, class_name: 'Address', dependent: :destroy
  has_one :shipping_address, -> { where(address_type: 'shipping') }, as: :addressable, class_name: 'Address', dependent: :destroy

  accepts_nested_attributes_for :order_items, allow_destroy: true
  accepts_nested_attributes_for :billing_address, allow_destroy: true
  accepts_nested_attributes_for :shipping_address, allow_destroy: true

  enum :status, { pending: 0, processing: 1,  shipped: 2, completed: 3, cancelled: 4 }

  validates :total_amount, numericality: { greater_than_or_equal_to: 0 }
  validates :customer_email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :customer_name, presence: true

  def from_cart(cart)
    cart.cart_items.each do |cart_item|
      order_items.build(
        product: cart_item.product,
        quantity: cart_item.quantity,
        price: cart_item.product.price,
      )
    end

    self.total_amount = cart.total_price
    self.status = :pending
    self
  end
end
