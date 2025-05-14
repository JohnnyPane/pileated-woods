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

      respond_with resource
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