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

describe Item do
  let(:retro) { Retro.create!(name: 'My Retro', video_link: 'the-video-link') }

  describe '#vote!' do
    it 'increments vote_count' do
      item = Item.create!(
        retro: retro,
        description: 'this is a happy item',
        category: Item.categories.fetch(:happy)
      )

      3.times do
        item.vote!
      end

      expect(item.vote_count).to eq(3)
    end

    it 'is atomic' do
      item1 = Item.create!(
        retro: retro,
        description: 'this is a happy item',
        category: Item.categories.fetch(:happy)
      )

      item2 = Item.find(item1.id)

      item1.vote!
      item2.vote!

      expect(item1.reload.vote_count).to eq(2)
    end
  end
end
