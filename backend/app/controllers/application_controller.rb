class ApplicationController < ActionController::API
  before_action :require_login

  private

  def require_login
    unless (user_id = session[:user_id])
      render json: { error: 'unauthorized' }, status: :unauthorized
      return
    end

    @current_user = User.find(user_id)
  end
end
