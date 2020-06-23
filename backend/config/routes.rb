Rails.application.routes.draw do
  resources :auth, only: [:create, :destroy]
  resources :tasks, only: [:index]
end
