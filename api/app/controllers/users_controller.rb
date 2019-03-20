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
  include UsersAuth

  def create
    google_user_details = GOOGLE_CLIENT.get_user! params.fetch(:access_token)

    if User.exists?(email: google_user_details[:email])
      head :multiple_choices
    else
      user = User.create!(
        email: google_user_details[:email],
        name: params[:full_name],
        company_name: params[:company_name]
      )

      render json: { auth_token: generate_user_token(user) }, status: :created
    end
  rescue GoogleClient::InvalidUserDomain
    head :forbidden
  end
end
