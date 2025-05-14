class LiveEdgeSlab < ApplicationRecord
  has_one :product, as: :productable, dependent: :destroy
end
