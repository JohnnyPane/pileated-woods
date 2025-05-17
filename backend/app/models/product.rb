class Product < ApplicationRecord
  include Imageable

  belongs_to :productable, polymorphic: true
  accepts_nested_attributes_for :productable, allow_destroy: true
  has_many_attached :images

  scope :in_stock, -> { where('stock > 0') }
  scope :live_edge_slabs, -> { where(productable_type: 'LiveEdgeSlab') }
end
