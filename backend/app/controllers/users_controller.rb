class UsersController < ApplicationController
  def create
    user = User.new(user_params)
    if user.save
      payload = { message: '登録が完了しました。', name: user.name }
    else
      payload = { error: user.errors.full_messages.join("\n") }
    end
    render json: payload
  end

  def show; end

  private

  def user_params
    params.require(:user).permit(:name, :email, :email_confirmation, :password, :password_confirmation)
  end
end
