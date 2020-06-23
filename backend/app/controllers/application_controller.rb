class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :set_session
  before_action :require_login

  @session = {}

  # rescue_from Pundit::NotAuthorizedError do |e|
  #   render json: { detail: e.message }, status: :unauthorized
  # end

  def require_login
    render json: { error: 'unauthorized' }, status: :unauthorized if @session.nil? || @session.empty?
  end

  # def current_user
  #   @session
  # end

  private
    def set_session
      authenticate_with_http_token do |token, options|
        @session = Session.get(token)
      end
    end
end
