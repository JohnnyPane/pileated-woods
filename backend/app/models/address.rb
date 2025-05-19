class Address < ApplicationRecord
  belongs_to :addressable, polymorphic: true

  validates :address_1, :city, :state, :zip, :country, presence: true

  def full_address
    [address_1, address_2, city, state, zip, country].compact.join(', ')
  end
end
