Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resources :auth, only: [:create, :destroy]
    resources :tasks, only: [:index]
  end
end
