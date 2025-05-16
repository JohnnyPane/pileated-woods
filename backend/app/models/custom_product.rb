class CustomProduct < ApplicationRecord
  include Productable
  has_one :product, as: :productable, dependent: :destroy
end
