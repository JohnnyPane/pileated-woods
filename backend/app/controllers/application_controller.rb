class ApplicationController < ActionController::API
  respond_to :json
  before_action :configure_permitted_parameters, if: :devise_controller?

  def self.navigational_formats
    []
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  def ensure_admin!
    unless current_user&.admin?
      render json: { error: 'Access denied' }, status: :forbidden
    end
  end
end
