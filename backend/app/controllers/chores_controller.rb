class ChoresController < ApplicationController
  skip_before_action :require_login, except: [:destroy]

  def contact
    AdminMailer.contact(
      contact: params[:contact],
      email: params[:email],
      user: current_user
    ).deliver_later
    render json: { message: 'お問い合わせを送信しました。' }
  end
end
