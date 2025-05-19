class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: ::JwtDenylist

  has_many :carts
  has_many :cart_items, through: :carts
  has_many :orders

  def most_recent_cart
    carts.order(created_at: :desc).first
  end

end
