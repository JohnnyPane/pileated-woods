module Api
  module V1
    class CartItemsController < ApplicationController
      include Cartable

      before_action :set_cart
      before_action :set_cart_item, only: [:update, :destroy]

      def create
        product = Product.find(params[:product_id])
        @cart_item = @cart.cart_items.find_or_initialize_by(product: product)
        @cart_item.quantity += params[:quantity].to_i

        if @cart_item.save
          render json: @cart_item, include: :product, status: :created
        else
          render json: { errors: @cart_item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        @cart_item.update(cart_item_params)

        render json: @cart_item, include: :product, status: :ok
      end

      def destroy
        @cart_item.destroy
        render json: { message: 'Cart item removed' }, status: :ok
      end

      private

      def set_cart
        if user_signed_in?
          @cart = current_user.most_recent_cart || create_cart_for_user
        else
          @cart = Cart.find_by(guest_token: guest_token) || create_cart_for_guest
        end
      end

      def set_cart_item
        @cart_item = @cart.cart_items.find(params[:id])
      end

      def cart_item_params
        params.require(:cart_item).permit(:quantity, :product_id, :cart_id)
      end

      def guest_token
        request.headers['X-Guest-Token']
      end

    end
  end
end