Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resources :auth, only: [:create, :destroy] do
      get :name, on: :collection
    end
    resources :tasks, only: [:index]
    resource :user, only: [:show]
  end
end
