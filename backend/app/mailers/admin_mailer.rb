class AdminMailer < ApplicationMailer
  def contact(contact:, email:, user:)
    @contact = contact
    @email = email
    @user = user ? "#{user.name}様 (id: #{user.id})" : 'ゲストユーザー様'

    admin_email = Rails.application.credentials.dig(:admin, :email)
    mail to: admin_email, subject: 'Punct:お問い合わせ'
  end
end
