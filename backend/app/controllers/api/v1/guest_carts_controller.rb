module Api
  module V1
    class GuestCartsController < ApplicationController
      include Cartable
      before_action :set_cart, only: [:show, :add_item, :remove_item, :update_quantity]

      def show
        render json: cart_as_json(@cart), status: :ok
      end

      def create
        @cart = Cart.create(guest_token: SecureRandom.uuid)
        render json: @cart, status: :created
      end

      def add_item
        product_id = guest_cart_params[:product_id]
        quantity = guest_cart_params[:quantity] || 1

        if @cart.add_item(product_id, quantity)
          render json: cart_as_json(@cart), status: :ok
        else
          product = Product.find(product_id)
          message = if product.nil?
                      'Product not found'
                    elsif product.stock < quantity
                      'Insufficient stock'
                    else
                      'Unable to add item to cart'
                    end

          render json: { error: message }, status: :unprocessable_entity
        end
      end

      def remove_item
        cart_item_id = guest_cart_params[:cart_item_id]

        if @cart.cart_items.find_by(id: cart_item_id).destroy
          render json: cart_as_json(@cart), status: :ok
        else
          render json: { error: 'Unable to remove item from cart' }, status: :unprocessable_entity
        end
      end

      def update_quantity
        cart_item_id = guest_cart_params[:cart_item_id]
        quantity = guest_cart_params[:quantity]

        cart_item = @cart.cart_items.find_by(id: cart_item_id)

        if cart_item.update(quantity: quantity)
          render json: cart_as_json(@cart), status: :ok
        else
          render json: { error: 'Unable to update item quantity' }, status: :unprocessable_entity
        end
      end

      private

      def set_cart
        guest_token = request.headers['X-Guest-Token']

        if guest_token.blank?
          render json: { error: 'Guest token is required' }, status: :unprocessable_entity
        end

        @cart = Cart.find_or_create_by(guest_token: guest_token)
      end

      def guest_cart_params
        params.require(:guest_cart).permit(:guest_token, :product_id, :quantity, :cart_item_id)
      end

    end
  end
end
