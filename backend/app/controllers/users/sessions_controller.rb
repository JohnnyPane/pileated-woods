module Users
  class SessionsController < Devise::SessionsController
    include RackSessionsFix
    before_action :authenticate_user!, only: [:destroy]

    respond_to :json

    def create
      user = warden.authenticate(auth_options)

      return invalid_login_attempt unless user

      self.resource = user
      sign_in(resource_name, resource)
      yield resource if block_given?

      guest_token = request.headers['X-Guest-Token']

      if guest_token.present?
        guest_cart = Cart.find_by(guest_token: guest_token)
        if guest_cart
          # Move items from guest cart to user cart
          user_cart = current_user.cart || Cart.create(user: current_user)
          guest_cart.transfer_to(user_cart)
        end
      end

      respond_with resource
    end

    def me
      if current_user
        respond_with current_user
      else
        throw(:warden, scope: :user)
      end
    end

    private

    def respond_with(resource, _opts = {})
      render json: {
        status: { code: 200, message: 'Logged in successfully.' },
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    end

    def respond_to_on_destroy
      if current_user
        render json: {
          status: 200,
          message: "Logged out successfully."
        }, status: :ok
      else
        render json: {
          status: 401,
          message: "Couldn't find an active session."
        }, status: :unauthorized
      end
    end

    def invalid_login_attempt
      render json: {
        status: 401,
        errors: {
          base: ['Invalid login credentials'],
        }
      }, status: :unauthorized
    end

  end
end