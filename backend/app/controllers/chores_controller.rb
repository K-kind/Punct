class ChoresController < ApplicationController
  skip_before_action :require_login, except: [:destroy]

  def contact
    render json: { message: 'お問い合わせを送信しました。' }
  end
end
