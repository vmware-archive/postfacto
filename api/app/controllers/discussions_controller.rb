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
class DiscussionsController < ApplicationController
  include RetrosAuth

  before_action :load_and_authenticate_retro

  def create
    item = @retro.items.find(params.require(:item_id))
    @retro.highlighted_item_id = item.id
    @retro.retro_item_end_time = 5.minutes.from_now
    @retro.save!

    RetrosChannel.broadcast(@retro)
    render 'retros/show'
  end

  def update
    @retro.retro_item_end_time = 2.minutes.from_now
    @retro.save!

    RetrosChannel.broadcast(@retro)
    render 'retros/show'
  end

  def destroy
    @retro.highlighted_item_id = nil
    @retro.save!

    RetrosChannel.broadcast(@retro)
    render json: :nothing, status: :no_content
  end
end
