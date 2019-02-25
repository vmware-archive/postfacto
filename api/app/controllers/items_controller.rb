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
class ItemsController < ApplicationController
  include RetrosAuth

  before_action :load_and_authenticate_retro

  def destroy
    item = @retro.items.find(params.fetch(:id))
    item.destroy!

    broadcast
    render json: :nothing, status: :no_content
  end

  def create
    @item = @retro.items.create!(item_params)
    broadcast
    render 'show', status: :created
  end

  def vote
    @item = @retro.items.find(params.fetch(:item_id))
    @item.vote!
    broadcast
    render 'show'
  end

  def update
    @retro.items.find(params.fetch(:id)).update!(update_item_params)

    broadcast
    render json: :nothing, status: :no_content
  end

  def done
    item = @retro.items.find(params.fetch(:item_id))
    item.done = done_value
    item.save!

    if @retro.highlighted_item_id == item.id
      @retro.highlighted_item_id = nil
      @retro.save!
    end

    broadcast
    render json: :nothing, status: :no_content
  end

  private

  def broadcast
    RetrosChannel.broadcast(@retro)
  end

  def item_params
    params.require(:item).permit(:description, :category)
  end

  def update_item_params
    params.require(:item).permit(:description)
  end

  def done_value
    params.include?(:done) ? params.fetch(:done) : true
  end
end
