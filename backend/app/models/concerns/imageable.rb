module Imageable
  extend ActiveSupport::Concern

  included do
    has_many_attached :images
  end

  IMAGE_SIZES = {
    default: [400, 500],
    thumbnail: [200, 250],
    cart: [100, 125],
  }.freeze

  def image_variants(size_key = :default)
    images.map do |image|
      size = IMAGE_SIZES[size_key] || IMAGE_SIZES[:default]
      image.variant(resize_to_fill: size).processed
    end
  end

  def image_urls(size_key = :default, only_path: true)
    image_variants(size_key).map do |image|
      Rails.application.routes.url_helpers.rails_blob_url(image, only_path: only_path)
    end
  end

  def thumbnail_image_urls
    image_urls(:thumbnail)
  end

  def cart_image_urls
    image_urls(:cart)
  end
end