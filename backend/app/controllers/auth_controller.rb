class AuthController < ApplicationController
  skip_before_action :require_login, only: [:create, :name]

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      status = :created
      message = 'ログインしました。'
    else
      status = :unauthorized
      message = 'メールアドレスまたはパスワードが正しくありません。'
    end
    render json: { message: message }, status: status
  end

  def destroy
    session.delete(:user_id)
  end

  def name
    name = ''
    if (user = User.find_by(id: session[:user_id]))
      name = user.name
    end
    render json: { name: name }
  end
end
