module Cartable
  extend ActiveSupport::Concern

  def create_cart_for_user
    cart = Cart.create(user: current_user)
    if session[:cart_id]
      guest_cart = Cart.find_by(id: session[:cart_id])
      if guest_cart
        guest_cart.cart_items.update_all(cart_id: cart.id)
        guest_cart.destroy
      end
      session.delete(:cart_id)
    end

    cart
  end

  def create_cart_for_guest
    cart = Cart.create
    session[:cart_id] = cart.id
    cart
  end
end