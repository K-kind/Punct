class ApplicationController < ActionController::API
  # include ActionController::HttpAuthentication::Token::ControllerMethods

  # before_action :set_session
  before_action :require_login

  private

  def require_login
    # binding.pry
    unless (user_id = session[:user_id])
      render json: { error: 'unauthorized' }, status: :unauthorized
      return
    end

    @current_user = User.find(user_id)
  end

  # def require_login
  #   if @session.nil? || @session.empty?
  #     render json: { error: 'unauthorized' }, status: :unauthorized
  #     return
  #   end

  #   @current_user = User.find(@session["user_id"])
  # end

  # def set_session
  #   authenticate_with_http_token do |token, options|
  #     @session = Session.get(token)
  #   end
  # end
end
