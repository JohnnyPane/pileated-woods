module Api
  module V1
    class ProductsController < ApplicationController
      include Rails.application.routes.url_helpers
      before_action :set_product, only: [:show]
      before_action :authenticate_user!, except: [:index, :show]

      def index
        @products = Product.all.includes(:productable).includes(images_attachments: :blob)

        render json: @products.map { |product| product_data(product) }, status: :ok
      end

      def show
        render json: product_data(@product), status: :ok
      end

      def create
        product = ProductWithProductableCreator.call(
          product_params: product_params,
          productable_params: productable_params
        )

        render json: product, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      rescue ArgumentError => e
        render json: { errors: [e.message] }, status: :bad_request
      end

      private

      def set_product
        @product = Product.find(params[:id])
      end

      def product_params
        params.require(:product).permit(
          :name, :description, :price, :featured, :stock, :productable_type,
          { images: [] },
        )
      end

      def productable_params
        params.require(:product).require(:productable_attributes).permit(
          :species, :width, :height, :length, :dried
        )
      end

      def product_data(product)
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          featured: product.featured,
          productable_type: product.productable_type,
          images: product.images.map { |image| rails_blob_url(image, only_path: true) }
        }
      end
    end
  end
end