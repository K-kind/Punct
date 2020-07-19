class UsersController < ApplicationController
  skip_before_action :require_login, only: [:create]

  def create
    user = User.new(user_params)
    if user.save(context: :signup)
      log_in user
      payload = { message: '登録が完了しました。', name: user.name }
    else
      payload = { errors: user.errors.full_messages }
    end
    render json: payload
  end

  def show
    render json: { user: @current_user.mypage_json }
  end

  def update
    payload = if @current_user.update(user_params)
                {
                  message: 'ユーザー情報を更新しました。',
                  user: @current_user.mypage_json
                }
              else
                { errors: @current_user.errors.full_messages }
              end
    render json: payload
  end

  def destroy
    log_out
    @current_user.destroy
    render json: { message: '退会しました。' }
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :email_confirmation, :password, :password_confirmation)
  end
end
