module Api
  module V1
    class ProductsController < ApplicationController
      before_action :set_product, only: [:show]

      def index
        @products = Product.all.includes(:productable)

        render json: @products, status: :ok
      end

      def show
        render json: @product, status: :ok
      end

      private

      def set_product
        @product = Product.find(params[:id])
      end
    end
  end
end