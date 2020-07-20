class ApplicationController < ActionController::API
  include ActionController::Cookies
  include SessionsHelper

  before_action :check_xhr_header
  before_action :require_login

  private

  def check_xhr_header
    return if request.xhr?

    render json: { error: 'forbidden' }, status: :forbidden
  end

  def require_login
    @current_user = current_user
    return if @current_user

    render json: { error: 'unauthorized' }, status: :unauthorized
  end
end
