class UsersController < ApplicationController
  skip_before_action :require_login, only: [:create]

  def create
    user = User.new(user_params)
    if user.save
      session[:user_id] = user.id
      payload = { message: '登録が完了しました。', name: user.name }
    else
      payload = { errors: user.errors.full_messages }
    end
    render json: payload
  end

  def show
    render json: { user: @current_user }
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :email_confirmation, :password, :password_confirmation)
  end
end
