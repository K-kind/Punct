Rails.application.routes.draw do
  # scope :api, defaults: { format: :json } do
  scope :api do
    resource :auth, only: [:create, :destroy], controller: 'auth' do
      get :name, on: :collection
      get '/failure',             to: 'auth#failure'
      get '/:provider/callback',  to: 'auth#success'
    end

    resources :tasks, only: [:index, :create, :update, :destroy] do
      get :chart, on: :collection
      post :order, on: :collection
      patch :start, on: :member
      patch :stop, on: :member
    end

    resources :weekly_tasks, only: [:index, :create, :update, :destroy] do
      post :order, on: :collection
    end

    resources :monthly_tasks, only: [:index, :create, :update, :destroy] do
      post :order, on: :collection
    end

    resource :user, only: [:create, :show, :update, :destroy]

    resource :password_reset, only: [:create, :update] do
      get :check
    end
  end
end
