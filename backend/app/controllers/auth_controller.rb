class AuthController < ApplicationController
  skip_before_action :require_login, only: [:create, :name]

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      payload = { message: 'ログインしました。', name: user.name }
      status = :created
    else
      payload = { message: 'メールアドレスまたはパスワードが正しくありません。' }
      status = :unauthorized
    end
    render json: payload, status: status
  end

  def destroy
    session.delete(:user_id)
    render json: { message: 'ログアウトしました。' }
  end

  def name
    name = ''
    if (user = User.find_by(id: session[:user_id]))
      name = user.name
    end
    render json: { name: name }
  end
end
