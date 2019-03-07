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

require 'rails_helper'

describe RetroFacilitator do
  let(:retro) {
    user = User.create!(email: 'me@example.com')
    Retro.create!(name: 'My Retro', user: user)
  }

  describe 'facilitate' do
    it 'should apply expected rules' do
      Item.create!(retro: retro, description: 'done', done: true, category: :happy, vote_count: 1)
      most_happy = Item.create!(retro: retro, description: 'most happy', category: :happy, vote_count: 20)
      happy1 = Item.create!(retro: retro, description: 'happy1', category: :happy, vote_count: 1)
      meh1 = Item.create!(retro: retro, description: 'meh1', category: :meh, vote_count: 1)
      sad1 = Item.create!(retro: retro, description: 'sad1', category: :sad, vote_count: 1)
      sad2 = Item.create!(retro: retro, description: 'sad2', category: :sad, vote_count: 2)

      items = RetroFacilitator.new.facilitate(retro)

      expect(items).to eq([happy1, meh1, sad2, sad1, most_happy])
    end
  end
end
