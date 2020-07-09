class AuthController < ApplicationController
  skip_before_action :require_login, only: [:create, :name, :success, :failure]

  def name
    name = ''
    if (user = User.find_by(id: session[:user_id]))
      name = user.name
    end
    render json: { name: name }
  end

  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      payload = { message: 'ログインしました。', name: user.name }
      status = :created
    else
      payload = { errors: ['メールアドレスまたはパスワードが正しくありません。'] }
      status = :ok
    end
    render json: payload, status: status
  end

  def destroy
    session.delete(:user_id)
    render json: { message: 'ログアウトしました。' }
  end

  def success
    auth = request.env['omniauth.auth']
    user = User.find_or_create_from_auth(auth)
    session[:user_id] = user.id
    redirect_to ENV.fetch('FRONTEND_URL')
  end

  def failure
    redirect_to ENV.fetch('FRONTEND_URL') + '/login'
  end
end
