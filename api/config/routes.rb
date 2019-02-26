#
# Postfacto, a free, open-source and self-hosted retro tool aimed at helping
# remote teams.
#
# Copyright (C) 2016 - Present Pivotal Software, Inc.
#
# This program is free software: you can redistribute it and/or modify
#
# it under the terms of the GNU Affero General Public License as
#
# published by the Free Software Foundation, either version 3 of the
#
# License, or (at your option) any later version.
#
#
#
# This program is distributed in the hope that it will be useful,
#
# but WITHOUT ANY WARRANTY; without even the implied warranty of
#
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#
# GNU Affero General Public License for more details.
#
#
#
# You should have received a copy of the GNU Affero General Public License
#
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#
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
    resource :discussion, only: [:create, :destroy, :update] do
      post 'transitions', controller: 'transitions'
    end
    get 'giphy', to: 'giphy#search'
  end
end
