module Api
  module V1
    class CartsController < ApplicationController
      include Cartable
      before_action :set_cart
      def show
        render json: @cart, include: [cart_items: { include: :product }], status: :ok
      end

      def create
        @cart = current_user.carts.create(guest_token: SecureRandom.uuid)
        render json: @cart, status: :created
      end

      private

      def set_cart
        if user_signed_in?
          @cart = current_user.cart || create_cart_for_user
        else
          @cart = Cart.find_by(id: params[:id]) || create_cart_for_guest
        end
      end

    end
  end
end
