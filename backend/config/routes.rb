Rails.application.routes.draw do
  scope :api, defaults: { format: :json } do
    resource :auth, only: [:create, :destroy], controller: 'auth' do
      get :name, on: :collection
    end

    resources :tasks, only: [:index, :create, :update, :destroy] do
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

    resource :user, only: [:create, :show]
  end
end
