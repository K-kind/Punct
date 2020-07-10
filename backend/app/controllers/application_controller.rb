class ApplicationController < ActionController::API
  include ActionController::Cookies
  include SessionsHelper

  before_action :require_login

  private

  def require_login
    @current_user = current_user
    return if @current_user

    render json: { error: 'unauthorized' }, status: :unauthorized
  end
end
