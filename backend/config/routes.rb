Rails.application.routes.draw do
  # scope :api, defaults: { format: :json } do
  scope :api do
    resource :auth, only: [:create, :destroy], controller: 'auth' do
      collection do
        get :name
        get :failure
        get '/:provider/callback', to: 'auth#success'
        post :test
      end
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
