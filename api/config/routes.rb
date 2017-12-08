Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  put '/retros/:id/archive', to: 'retros#archive'
  get '/retros/:id/login', to: 'retros#show_login'
  put '/retros/:id/login', to: 'retros#login'
  patch '/retros/:id/password', to: 'retros#update_password', as: :retro_update_password

  get '/config', to: 'config#show'

  resources :sessions, only: [:create]
  resources :users, only: [:create]

  resources :retros, only: [:create, :index, :show, :update] do
    resources :archives, only: [:index, :show]
    resources :settings, only: [:index]
    resources :action_items, only: [:create, :destroy, :update]
    resources :items, only: [:create, :update, :destroy] do
      patch 'done', to: :done, controller: 'items'
      post 'vote', to: :vote, controller: 'items'
    end
    resource :discussion, only: [:create, :destroy, :update]
  end
end
