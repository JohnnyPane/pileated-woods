class Address < ApplicationRecord
  belongs_to :addressable, polymorphic: true

  validates :address_1, :city, :state, :zip, :country, presence: true
end
