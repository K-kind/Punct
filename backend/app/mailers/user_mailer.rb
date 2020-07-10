class UserMailer < ApplicationMailer
  def password_reset(user:, user_reset_token:)
    base_url = ENV.fetch('FRONTEND_URL') + '/reset'
    params = "?email=#{user.email}&token=#{user_reset_token}"
    @reset_url = base_url + params
    @user_name = user.name
    mail to: user.email, subject: 'Punct:パスワードリセット用メール'
  end
end
