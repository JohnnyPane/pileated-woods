module Api
  module V1
    class OrdersController < ApplicationController
      before_action :authenticate_user!, only: [:index]
      before_action :set_cart_token, :set_cart, only: [:create]
      before_action :ensure_admin!, only: [:index, :update, :destroy]

      def index
        if user_signed_in?
          @orders = current_user.admin? ? orders_as_list_json : current_user.orders.order(created_at: :desc)
        else
          if params[:customer_email].present?
            @orders = Order.where(customer_email: params[:customer_email]).order(created_at: :desc)
          else
            @orders = []
          end
        end

        render json: @orders
      end

      def show
        if user_signed_in?
          @order = current_user.orders.find_by(id: params[:id])
        else
          @order = Order.find_by(id: params[:id])
        end

        if @order
          render json: @order, include: [order_items: { include: :product }]
        else
          render json: { error: 'Order not found' }, status: :not_found
        end
      end

      # TODO: Refactor this to use a service object
      def create
        if @cart.cart_items.empty?
          return render json: { error: 'Your cart is empty' }, status: :unprocessable_entity
        end

        if user_signed_in?
          @order = current_user.orders.build(order_params)
        else
          @order = Order.new(order_params)
        end

        @order.from_cart(@cart)

        if @order.save
          begin
            @order.build_shipping_address(shipping_address_params)
            @order.build_billing_address(billing_address_params) if order_params[:billing_same_as_shipping] == 'false'

            payment_intent = StripeService.new(@order, params[:order][:payment_method]).create_charge

            if payment_intent.status == 'succeeded'
              @order.update(
                stripe_payment_id: payment_intent.id,
                status: :processing,
                paid: true,
              )

              @cart.cart_items.destroy_all

              render json: @order, status: :created
            else
              @order.update(status: :pending)
              render json: { error: 'Payment processing issue', payment_intent_id: payment_intent.id }, status: :payment_required
            end
          rescue Stripe::CardError => e
            render json: { error: e.message }, status: :payment_required
          rescue => e
            render json: { error: 'Something went wrong with the payment' }, status: :unprocessable_entity
          end
        else
          render json: { error: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        @order = Order.find(params[:id])

        if @order.update(order_params)
          render json: @order
        else
          render json: { error: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @order = Order.find(params[:id])

        if !@order.paid && @order.destroy
          render json: { message: 'Order deleted successfully' }, status: :ok
        else
          render json: { error: 'Failed to delete order' }, status: :unprocessable_entity
        end
      end

      private

      def set_cart
        if user_signed_in?
          @cart = current_user.cart || Cart.find_by(guest_token: @cart_token)
        else
          @cart = Cart.find_by(guest_token: @cart_token)
        end

        if @cart.nil?
          raise ActiveRecord::RecordNotFound, "Cart not found"
        end
      end

      def set_cart_token
        @cart_token = request.headers['X-Guest-Token']
      end

      def orders_as_list_json
        @orders = Order.all.includes(:shipping_address, :order_items).order(created_at: :desc)
        OrderSerializer.new(@orders).serializable_hash[:data].map { |o| o[:attributes] }
      end

      def order_params
        params.require(:order).permit(
          :customer_name,
          :customer_email,
          :phone,
          :billing_same_as_shipping,
          :status,
        )
      end

      def shipping_address_params
        params.require(:order).require(:shipping_address_attributes).permit(
          :address_1, :address_2, :city, :state, :zip, :country
        )
      end

      def billing_address_params
        params.require(:order).require(:billing_address_attributes).permit(
          :address_1, :address_2, :city, :state, :zip, :country
        )
      end
    end
  end
end