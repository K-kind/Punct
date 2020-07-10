class UsersController < ApplicationController
  skip_before_action :require_login, only: [:create]

  def create
    user = User.new(user_params)
    if user.save(context: :signup)
      session[:user_id] = user.id
      payload = { message: '登録が完了しました。', name: user.name }
    else
      payload = { errors: user.errors.full_messages }
    end
    render json: payload
  end

  def show
    user = {
      name: @current_user.name,
      email: @current_user.email,
      provider: @current_user.provider
    }
    render json: { user: user }
  end

  def update
    if @current_user.update(user_params)
      user = {
        name: @current_user.name,
        email: @current_user.email,
        provider: @current_user.provider
      }
      payload = { message: 'ユーザー情報を更新しました。', user: user }
    else
      payload = { errors: @current_user.errors.full_messages }
    end
    render json: payload
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :email_confirmation, :password, :password_confirmation)
  end
end
