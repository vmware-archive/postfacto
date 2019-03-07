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
require 'clients/google_client'

class UsersController < ApplicationController
  def create
    google_user = GOOGLE_CLIENT.get_user! params.fetch(:access_token)
    user = google_user.slice(:email)

    assign_name_and_company_name_from_params(google_user, user)
    return_user(google_user, user)
  rescue GoogleClient::InvalidUserDomain
    head :forbidden
  end

  def return_user(google_user, user)
    if User.exists?(google_user.slice(:email))
      head :multiple_choices
    else
      user = User.create!(user)
      token = AuthToken.generate(user.id, 'users', CLOCK.now, nil, Rails.application.secrets.secret_key_base)

      render json: { auth_token: token }, status: :created
    end
  end

  def assign_name_and_company_name_from_params(google_user, user)
    if params[:company_name].present?
      user[:company_name] = params.fetch(:company_name)
    end
    user[:name] = google_user[:name]
    if params[:full_name].present?
      user[:name] = params.fetch(:full_name)
    end
  end
end
