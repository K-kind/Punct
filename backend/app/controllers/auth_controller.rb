class AuthController < ApplicationController
  skip_before_action :require_login, only: [:create]

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      status = :created
      message = 'Login succeeded'
    else
      status = :unauthorized
      message = 'Login failed'
    end
    render json: { message: message }, status: status
  end

  def destroy
    session.delete(:user_id)
  end
end
