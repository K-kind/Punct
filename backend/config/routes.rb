Rails.application.routes.draw do
  resources :auth, only: [:create, :destroy]
end
