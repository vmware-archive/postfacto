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
class ActionItemsController < ApplicationController
  include RetrosAuth

  before_action :load_and_authenticate_retro

  def create
    @action_item = @retro.action_items.create!(action_params)
    RetrosChannel.broadcast(@retro)
    render 'show', status: :created
  end

  def update
    @action_item = @retro.action_items.find(params.fetch(:id))
    @action_item.update!(action_params)
    RetrosChannel.broadcast(@retro)
    render 'show'
  end

  def destroy
    action_item = @retro.action_items.find(params.fetch(:id))
    action_item.destroy!
    RetrosChannel.broadcast(@retro)
    render json: :nothing, status: :no_content
  end

  private

  def action_params
    params.require(:action_item).permit(:description, :done)
  end
end
