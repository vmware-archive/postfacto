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
require 'security/auth_token'

class SessionsController < ApplicationController
  include RetrosAuth

  before_action :load_retro

  def new
  end

  def create
    password = retro_params.fetch(:password, nil)
    if password
      login_with_password(password)
    elsif @retro.magic_link_enabled?
      join_token = retro_params.fetch(:join_token, nil)
      login_with_join_token(join_token)
    else
      forbidden
    end
  end

  private

  def login_with_password(password)
    if @retro.validate_login?(password)
      render json: { token: generate_retro_token(@retro) }, status: :ok
    else
      forbidden
    end
  end

  def login_with_join_token(join_token)
    if @retro.validate_join_token?(join_token)
      render json: { token: generate_retro_token(@retro) }, status: :ok
    else
      forbidden
    end
  end

  def forbidden
    render json: :no_content, status: :forbidden
  end

  def retro_params
    params.require(:retro).permit(:name, :slug, :password, :item_order, :is_private, :join_token)
  end
end
