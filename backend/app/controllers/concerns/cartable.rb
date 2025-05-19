module Cartable
  extend ActiveSupport::Concern

  def create_cart_for_user
    @cart = current_user.carts.create
  end

  def create_cart_for_guest
    @cart = Cart.find_or_create_by(guest_token: SecureRandom.uuid)
  end

  def guest_token
    request.headers['X-Guest-Token']
  end

  def cart_as_json(cart)
    cart.as_json(
      include: {
        cart_items: {
          include: {
            product: {
              methods: [:cart_image_urls]
            }
          }
        }
      }
    )
  end
end